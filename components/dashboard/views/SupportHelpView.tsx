import React, { useState, ChangeEvent, FormEvent, useRef, useEffect, useCallback } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { LifebuoyIcon } from '../../icons/LifebuoyIcon';
import { TicketIcon } from '../../icons/TicketIcon';
// FIX: Corrected import path casing for PaperclipIcon to match the actual filename.
import { PaperclipIcon } from '../../icons/PaperClipIcon';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import { QuestionMarkCircleIcon } from '../../icons/QuestionMarkCircleIcon';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { ChevronUpIcon } from '../../icons/ChevronUpIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import apiClient from '../../../utils/apiClient';
import { useToast, useSocket } from '../../../hooks/useToast';

import { SupportTicket, SupportTicketCategory, SupportTicketStatus, SelectOption as AppSelectOption, UserFeatures, MembershipTier, SupportTicketMessage } from '../../../types'; 
import UpgradePrompt from '../../common/UpgradePrompt'; 

interface Faq {
    id: string;
    question: string;
    answer: string;
}

const FaqItem: React.FC<{ faq: Faq }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full text-left" aria-expanded={isOpen}><span className="font-medium text-gray-700">{faq.question}</span>{isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-500" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500" />}</button>
      {isOpen && <p className="mt-2 text-sm text-gray-600 pr-4">{faq.answer}</p>}
    </div>
  );
};

const ticketCategoryOptions: AppSelectOption<SupportTicketCategory>[] = Object.values(SupportTicketCategory).map(val => ({ value: val, label: val }));

interface SupportHelpViewProps {
  userFeatures: UserFeatures;
  onUpgradeClick: () => void;
}

const SupportHelpView: React.FC<SupportHelpViewProps> = ({ userFeatures, onUpgradeClick }) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicketCategory | ''>('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { showToast } = useToast();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  useEffect(() => {
    const fetchFaqs = async () => {
        try {
            const data = await apiClient('/api/content/faqs');
            setFaqs(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    fetchFaqs();
  }, [showToast]);

  const fetchTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    try {
        const data = await apiClient('/api/tickets');
        setSubmittedTickets(data);
    } catch (error: any) {
        showToast(error.message, 'error');
    } finally {
        setIsLoadingTickets(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);
  
  useEffect(() => {
    if (!viewingTicket) return;

    const handleMessageReceived = (data: { ticketId: string, message: SupportTicketMessage }) => {
        if (data.ticketId === viewingTicket.id) {
            setViewingTicket(prev => {
                if (!prev) return null;
                return { ...prev, messages: [...prev.messages, data.message] };
            });
        }
    };
    
    const handleTicketUpdate = (updatedTicket: SupportTicket) => {
        setSubmittedTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        if (viewingTicket?.id === updatedTicket.id) {
            setViewingTicket(updatedTicket);
        }
    };

    socket.emit('join_ticket_room', viewingTicket.id);
    socket.on('message_received', handleMessageReceived);
    socket.on('ticket_updated', handleTicketUpdate);

    // Cleanup
    return () => {
        socket.emit('leave_ticket_room', viewingTicket.id);
        socket.off('message_received', handleMessageReceived);
        socket.off('ticket_updated', handleTicketUpdate);
    };
  }, [viewingTicket, socket]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [viewingTicket?.messages]);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketCategory || !ticketDescription) {
        showToast("Please fill all required fields.", 'error');
        return;
    }
    
    try {
      const newTicket = await apiClient('/api/tickets', {
        method: 'POST',
        body: { subject: ticketSubject, category: ticketCategory, description: ticketDescription },
      });
      showToast('Support ticket submitted successfully!', 'success');
      setTicketSubject(''); setTicketCategory(''); setTicketDescription('');
      setSubmittedTickets(prev => [newTicket, ...prev]);
      setViewingTicket(newTicket);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
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
  
  const handleSendTicketReply = async () => {
    if ((!replyMessage.trim() && !fileToUpload) || !viewingTicket) return;
    
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
            ticketId: viewingTicket.id,
            sender: 'user',
            text: replyMessage || (filePayload ? filePayload.name : ''),
            file: filePayload,
        });
        
        const tempFileUrl = fileToUpload ? URL.createObjectURL(fileToUpload) : undefined;
        const optimisticMessage: SupportTicketMessage = {
          sender: 'user', 
          text: replyMessage || (filePayload ? filePayload.name : ''), 
          timestamp: new Date().toISOString(),
          file: filePayload ? { ...filePayload, url: tempFileUrl! } : undefined
        };
        setViewingTicket(prev => prev ? {...prev, messages: [...prev.messages, optimisticMessage]} : null);
        
        setReplyMessage('');
        setFileToUpload(null);

    } catch (err: any) {
        showToast(err.message, 'error');
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center"><LifebuoyIcon className="w-6 h-6 mr-2 text-rose-500" />Support & Help Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><TicketIcon className="w-5 h-5 mr-2 text-rose-500" />Raise a Support Ticket</h3>
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <Input id="ticketSubject" name="ticketSubject" label="Subject" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} required />
            <Select id="ticketCategory" name="ticketCategory" label="Category" options={ticketCategoryOptions} value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value as SupportTicketCategory)} placeholder="Select a category" required />
            <div><label htmlFor="ticketDescription" className="block text-xs font-medium text-gray-600 mb-0.5">Description</label><textarea id="ticketDescription" name="ticketDescription" value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)} rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required></textarea></div>
            <Button type="submit" variant="primary" className="w-full !bg-rose-500">Submit Ticket</Button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-rose-500" />FAQs</h3>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">{faqs.map(faq => <FaqItem key={faq.id} faq={faq} />)}</div>
          </div>
        </div>
      </div>

      {isLoadingTickets ? <p>Loading your tickets...</p> : submittedTickets.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">My Submitted Tickets</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {submittedTickets.map(ticket => (
                    <div key={ticket.id} className="p-3 border rounded-md hover:shadow-sm">
                      <p className="font-medium text-gray-800">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">Status: <span className="font-semibold">{ticket.status}</span> | Updated: {new Date(ticket.lastUpdatedDate || ticket.createdDate).toLocaleString()}</p>
                      <Button variant="secondary" size="sm" onClick={() => setViewingTicket(ticket)} className="!text-xs mt-1">View Details</Button>
                    </div>
                ))}
            </div>
        </div>
      )}
      
      {viewingTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
              <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-3 border-b pb-2"><h3 className="text-lg font-semibold">Ticket: {viewingTicket.subject}</h3><Button variant="secondary" size="sm" onClick={() => setViewingTicket(null)} className="!p-1.5 !rounded-full"><XMarkIcon className="w-4 h-4"/></Button></div>
                  <div className="flex-grow space-y-2 overflow-y-auto mb-3 p-2 bg-gray-50 rounded-md min-h-[200px] custom-scrollbar">
                      {viewingTicket.messages.map((msg, index) => ( 
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>
                                {msg.file?.type === 'image' && <img src={msg.file.url} alt={msg.file.name} className="max-w-full h-auto max-h-48 rounded-md mb-1 cursor-pointer" onClick={() => window.open(msg.file.url, '_blank')} />}
                                {msg.file?.type === 'file' && <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-500/20 p-2 rounded-md hover:bg-gray-500/40 mb-1"><DocumentTextIcon className="w-5 h-5 flex-shrink-0 text-gray-700"/><span>{msg.file.name}</span></a>}
                                {msg.text && <p className="text-sm">{msg.text}</p>}
                                <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-rose-200 text-right' : 'text-gray-500 text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div> 
                      ))}
                      <div ref={messagesEndRef} />
                  </div>
                  {viewingTicket.status !== SupportTicketStatus.CLOSED ? (
                      <div className="border-t pt-3 space-y-2">
                           {fileToUpload && (
                                <div className="p-2 bg-gray-100 rounded-md flex items-center justify-between text-xs">
                                    <span className="text-gray-600 truncate">{fileToUpload.name}</span>
                                    <Button variant="secondary" size="sm" onClick={() => setFileToUpload(null)} className="!p-1 !rounded-full"><XMarkIcon className="w-3 h-3"/></Button>
                                </div>
                            )}
                          <div className="flex items-start space-x-2">
                               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                               <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="!p-2.5" title="Attach file"><PaperclipIcon className="w-5 h-5"/></Button>
                               <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendTicketReply(); }}} placeholder="Type your reply..." rows={2} className="w-full p-2 border rounded-md text-sm flex-grow"></textarea>
                               <Button onClick={handleSendTicketReply} variant="primary" size="sm" className="!p-2.5 !bg-rose-500" isLoading={isUploading} disabled={isUploading}>Send</Button>
                          </div>
                      </div>
                  ) : <p className="text-center text-sm text-gray-500 border-t pt-3">This ticket is closed. To reopen, please create a new ticket.</p>}
              </div>
          </div>
      )}
    </div>
  );
};

export default SupportHelpView;