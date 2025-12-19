import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { QueueListIcon } from '../../icons/QueueListIcon';
import { UserIcon } from '../../icons/UserIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { PlusCircleIcon } from '../../icons/PlusCircleIcon';
import { PhonebookContact } from '../../../types';
import { API_URL } from '../../../utils/config';


const PhonebookView: React.FC = () => {
  const [contacts, setContacts] = useState<PhonebookContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingContactNotes, setEditingContactNotes] = useState<{ id: string; notes: string } | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/users/phonebook`, { headers: { 'x-auth-token': token || '' } });
        if (!res.ok) throw new Error('Failed to fetch phonebook contacts.');
        const data = await res.json();
        setContacts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleRemoveContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to remove this contact from your phonebook?')) {
      // TODO: API call to remove contact
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      alert('Contact removed. (Mock)');
    }
  };

  const handleOpenNotesModal = (contact: PhonebookContact) => {
    setEditingContactNotes({ id: contact.id, notes: contact.notes || '' });
  };

  const handleSaveNotes = () => {
    if (editingContactNotes) {
      // TODO: API call to save notes
      setContacts(prev => prev.map(contact => 
        contact.id === editingContactNotes.id ? { ...contact, notes: editingContactNotes.notes } : contact
      ));
      alert('Notes saved. (Mock)');
      setEditingContactNotes(null);
    }
  };
  
  const handleAddContact = () => {
      alert("Navigate to a user's profile to add them to your phonebook (mock).");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <QueueListIcon className="w-8 h-8 text-rose-500" />
            <h2 className="text-2xl font-semibold text-gray-800">My Phonebook</h2>
        </div>
        <Button onClick={handleAddContact} variant="primary" size="sm" className="!bg-green-500 hover:!bg-green-600">
            <PlusCircleIcon className="w-5 h-5 mr-1"/> Add New Contact
        </Button>
      </div>
      <p className="text-gray-600 text-sm">
        Keep track of your important connections and add personal notes. Contacts are added automatically upon mutual interest.
      </p>

      {isLoading ? (
        <p>Loading contacts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map(contact => (
            <div key={contact.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={contact.photoUrl || 'https://via.placeholder.com/50/CCCCCC/FFFFFF?Text=?'} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-700">{contact.name}</h3>
                  <p className="text-xs text-gray-500">ID: {contact.profileId} | {contact.city}</p>
                  <p className="text-xs text-rose-500">{contact.status}</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Notes:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded min-h-[40px] whitespace-pre-wrap">
                  {contact.notes || 'No notes added yet.'}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleOpenNotesModal(contact)} className="!text-xs !py-1">
                  <PencilIcon className="w-3 h-3 mr-1"/> {contact.notes ? 'Edit Note' : 'Add Note'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleRemoveContact(contact.id)} className="!text-xs !py-1">
                  <TrashIcon className="w-3 h-3 mr-1"/> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <QueueListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Your phonebook is empty.</p>
            <p className="text-xs text-gray-400 mt-1">When you have a mutual interest with someone, they will appear here.</p>
        </div>
      )}

      {/* Notes Modal */}
      {editingContactNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Notes for {contacts.find(c => c.id === editingContactNotes.id)?.name}
            </h3>
            <textarea
              value={editingContactNotes.notes}
              onChange={(e) => setEditingContactNotes({ ...editingContactNotes, notes: e.target.value })}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-sm custom-scrollbar"
              placeholder="Enter your private notes here..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setEditingContactNotes(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveNotes} className="!bg-rose-500 hover:!bg-rose-600">Save Notes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhonebookView;