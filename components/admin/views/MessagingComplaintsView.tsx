import React, { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import Button from '../../ui/Button';
import { useToast, useSocket } from '../../../hooks/useToast';
import apiClient from '../../../utils/apiClient';
import { SupportTicket, SupportTicketStatus, SupportTicketMessage } from '../../../types';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { PaperclipIcon } from '../../icons/PaperclipIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';

const MessagingComplaintsView: React.FC = () => {
  const [complaints, setComplaints] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeComplaint, setActiveComplaint] = useState<SupportTicket | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [filterStatus, setFilterStatus] = useState<SupportTicketStatus | ''>('');
  const { showToast } = useSocket();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await apiClient('/api/admin/complaints');
        setComplaints(data);
    } catch(err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchComplaints();

    const handleNewTicket = (newTicket: SupportTicket) => {
        setComplaints(prev => [newTicket, ...prev]);
        showToast(`New support ticket #${newTicket.id.slice(-6)} received`, 'info');
    };

    const handleTicketUpdate = (updatedTicket: SupportTicket) => {
        setComplaints(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        if (activeComplaint && activeComplaint.id === updatedTicket.id) {
            setActiveComplaint(updatedTicket);
        }
    };

    socket.on('new_ticket_created', handleNewTicket);
    socket.on('ticket_updated', handleTicketUpdate);

    return () => {
        socket.off('new_ticket_created', handleNewTicket);
        socket.off('ticket_updated', handleTicketUpdate);
    };

  }, [fetchComplaints, socket, showToast, activeComplaint]);

  useEffect(() => {
    if (!activeComplaint) return;

    const handleMessageReceived = (data: { ticketId: string; message: SupportTicketMessage }) => {
        if (data.ticketId === activeComplaint.id) {
            setActiveComplaint(prev => {
                if (!prev) return null;
                return { ...prev, messages: [...prev.messages, data.message] };
            });
        }
    };
    
    socket.emit('join_ticket_room', activeComplaint.id);
    socket.on('message_received', handleMessageReceived);

    return () => {
        if (activeComplaint) {
            socket.emit('leave_ticket_room', activeComplaint.id);
        }
        socket.off('message_received', handleMessageReceived);
    };
  }, [activeComplaint, socket]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeComplaint?.messages]);


  const handleViewDetails = (complaint: SupportTicket) => {
    const latestComplaint = complaints.find(c => c.id === complaint.id) || complaint;
    setActiveComplaint(latestComplaint);
    setAdminReply(''); 
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit
            showToast('File size should not exceed 5MB.', 'error');
            return;
        }
        setFileToUpload(e.target.files[0]);
    }
  };
  
  const handleSendReply = async () => {
    if ((!adminReply.trim() && !fileToUpload) || !activeComplaint) return;

    setIsUploading(true);
    try {
        let filePayload: SupportTicketMessage['file'] | undefined = undefined;

        if (fileToUpload) {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', fileToUpload);
            cloudinaryFormData.append('upload_preset', 'attut_bandhan');

            const cloudinaryData = await apiClient('https://api.cloudinary.com/v1_1/dvrqft9ov/image/upload', {
                method: 'POST',
                body: cloudinaryFormData
            });
            
            const isImage = fileToUpload.type.startsWith('image/');
            filePayload = {
                url: cloudinaryData.secure_url,
                name: fileToUpload.name,
                type: isImage ? 'image' : 'file',
            };
        }

        socket.emit('new_message', {
            ticketId: activeComplaint.id,
            sender: 'admin',
            text: adminReply || (filePayload ? filePayload.name : ''),
            file: filePayload,
        });
        
        // Optimistic update
        const tempFileUrl = fileToUpload ? URL.createObjectURL(fileToUpload) : undefined;
        const optimisticMessage: SupportTicketMessage = {
          sender: 'admin', 
          text: adminReply || (filePayload ? filePayload.name : ''),
          timestamp: new Date().toISOString(),
          file: filePayload ? { ...filePayload, url: tempFileUrl! } : undefined
        };
        setActiveComplaint(prev => prev ? {...prev, messages: [...prev.messages, optimisticMessage]} : null);

        setAdminReply('');
        setFileToUpload(null);

    } catch (err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsUploading(false);
    }
  };


  const statusOptions = [{value: '', label: 'All Statuses'}, ...Object.values(SupportTicketStatus).map(s => ({value: s, label: s}))];
  
  const filteredComplaints = filterStatus
    ? complaints.filter(c => c.status === filterStatus)
    : complaints;

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex items-center space-x-3">
        <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-rose-400" />
        <h1 className="text-3xl font-bold">Messaging & Complaints</h1>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg shadow">
          <label htmlFor="status-filter" className="text-sm text-gray-400 mr-2">Filter by Status:</label>
          <select id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as SupportTicketStatus | '')} className="bg-gray-600 border-gray-500 rounded p-1.5 text-sm text-white">
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
      </div>

      <div className="bg-gray-700 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-750">
                <tr>{['User', 'Subject', 'Category', 'Status', 'Last Updated', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
                {isLoading ? (<tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>) :
                 filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-gray-650">
                        <td className="px-4 py-3 text-sm text-white">{(complaint as any).user?.fullName || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate" title={complaint.subject}>{complaint.subject}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{complaint.category}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full 
                            ${complaint.status === SupportTicketStatus.OPEN ? 'bg-yellow-700 text-yellow-100' :
                             complaint.status === SupportTicketStatus.IN_PROGRESS ? 'bg-blue-700 text-blue-100' :
                             'bg-gray-500 text-gray-100'}`}>{complaint.status}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{new Date(complaint.lastUpdatedDate).toLocaleString()}</td>
                        <td className="px-4 py-3"><Button size="sm" className="!text-xs" onClick={() => handleViewDetails(complaint)}>View Details</Button></td>
                    </tr>
                )) : (<tr><td colSpan={6} className="text-center p-4 text-gray-400">No complaints found.</td></tr>)}
            </tbody>
        </table>
      </div>

      {activeComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                      <h3 className="text-lg font-semibold">Ticket: {activeComplaint.subject}</h3>
                      <Button variant="secondary" size="sm" onClick={() => setActiveComplaint(null)} className="!p-1.5 !rounded-full !bg-gray-700 hover:!bg-gray-600"><XMarkIcon className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex-grow space-y-2 overflow-y-auto mb-3 p-2 bg-gray-900 rounded-md min-h-[250px] custom-scrollbar">
                      {activeComplaint.messages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-rose-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                  {msg.file?.type === 'image' && <img src={msg.file.url} alt={msg.file.name} className="max-w-full h-auto max-h-48 rounded-md mb-1 cursor-pointer" onClick={() => window.open(msg.file.url, '_blank')} />}
                                  {msg.file?.type === 'file' && <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-500/50 p-2 rounded-md hover:bg-gray-400/50 mb-1"><DocumentTextIcon className="w-5 h-5 flex-shrink-0"/><span>{msg.file.name}</span></a>}
                                  {msg.text && <p>{msg.text}</p>}
                                  <p className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-rose-200 text-right' : 'text-gray-400 text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                  </p>
                              </div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t border-gray-600 pt-3 space-y-2">
                      {fileToUpload && (
                          <div className="p-2 bg-gray-700 rounded-md flex items-center justify-between text-xs">
                              <span className="text-gray-300 truncate">{fileToUpload.name}</span>
                              <Button variant="secondary" size="sm" onClick={() => setFileToUpload(null)} className="!p-1 !rounded-full"><XMarkIcon className="w-3 h-3"/></Button>
                          </div>
                      )}
                      <div className="flex items-start space-x-2">
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="!p-2.5 !bg-gray-700" title="Attach file"><PaperclipIcon className="w-5 h-5"/></Button>
                          <textarea 
                              value={adminReply} 
                              onChange={(e) => setAdminReply(e.target.value)} 
                              onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); }}}
                              placeholder={activeComplaint.status === 'Closed' ? "Replying will reopen this ticket..." : "Type your reply..."}
                              rows={2} 
                              className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-sm text-white custom-scrollbar flex-grow"
                          ></textarea>
                          <Button onClick={handleSendReply} variant="primary" size="sm" className="!p-2.5 !bg-rose-500" isLoading={isUploading} disabled={isUploading}>Send</Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MessagingComplaintsView;