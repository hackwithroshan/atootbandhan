import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { LifebuoyIcon } from '../../icons/LifebuoyIcon';
import { TicketIcon } from '../../icons/TicketIcon';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { QuestionMarkCircleIcon } from '../../icons/QuestionMarkCircleIcon';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { ChevronUpIcon } from '../../icons/ChevronUpIcon';
import { XMarkIcon } from '../../icons/XMarkIcon';
import { LockClosedIcon } from '../../icons/LockClosedIcon';
import apiClient from '../../../utils/apiClient';
import { useToast } from '../../../hooks/useToast';

import { SupportTicket, SupportTicketCategory, SupportTicketStatus, SelectOption as AppSelectOption, UserFeatures, MembershipTier } from '../../../types'; 
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

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
        const data = await apiClient('/api/tickets');
        setSubmittedTickets(data);
    } catch (error: any) {
        showToast(error.message, 'error');
    } finally {
        setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketCategory || !ticketDescription) {
        showToast("Please fill all required fields.", 'error');
        return;
    }
    
    try {
      await apiClient('/api/tickets', {
        method: 'POST',
        body: { subject: ticketSubject, category: ticketCategory, description: ticketDescription },
      });
      showToast('Support ticket submitted successfully!', 'success');
      setTicketSubject(''); setTicketCategory(''); setTicketDescription('');
      fetchTickets();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };
  
  const handleSendTicketReply = async () => {
    if (!replyMessage.trim() || !viewingTicket) return;
    try {
      const updatedTicket = await apiClient(`/api/tickets/${viewingTicket.id}/reply`, {
        method: 'PUT',
        body: { text: replyMessage },
      });
      
      setViewingTicket(updatedTicket);
      setSubmittedTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      setReplyMessage('');
      showToast('Reply sent!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
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
                  <div className="flex-grow space-y-2 overflow-y-auto mb-3 p-2 bg-gray-50 rounded-md min-h-[200px]">
                      {viewingTicket.messages.map((msg, index) => ( <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}><p className="text-sm">{msg.text}</p></div></div> ))}
                  </div>
                  {viewingTicket.status !== SupportTicketStatus.CLOSED && (
                      <div className="border-t pt-3 space-y-2">
                          <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." rows={3} className="w-full p-2 border rounded-md text-sm"></textarea>
                          <Button onClick={handleSendTicketReply} variant="primary" size="sm" className="!text-xs !bg-rose-500">Send Reply</Button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default SupportHelpView;
