import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loading from '../common/Loading';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { formatDate } from '../../utils/formatters';

const MessagesList = ({ adminId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [adminId, filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let q;
      
      if (filter === 'all') {
        q = query(
          collection(db, 'adminMessages'),
          where('adminId', '==', adminId),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      } else if (filter === 'unread') {
        q = query(
          collection(db, 'adminMessages'),
          where('adminId', '==', adminId),
          where('isRead', '==', false),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      } else {
        q = query(
          collection(db, 'adminMessages'),
          where('adminId', '==', adminId),
          where('isRead', '==', true),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedMessages = [];
      
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      urgent: 'resolved',
      high: 'pending',
      normal: 'in_progress',
    };
    return variants[priority] || 'default';
  };

  const getPriorityText = (priority) => {
    const texts = {
      urgent: 'Urgent',
      high: 'High Priority',
      normal: 'Normal',
    };
    return texts[priority] || priority;
  };

  if (loading) {
    return <Loading text="Loading messages..." />;
  }

  if (messages.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t sent any messages yet.' 
              : `No ${filter} messages found.`}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Header with filters */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-800">Sent Messages ({messages.length})</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === 'read'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Messages list */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`border rounded-lg p-4 ${
                message.isRead ? 'bg-gray-50' : 'bg-white border-primary-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityBadge(message.priority)}>
                    {getPriorityText(message.priority)}
                  </Badge>
                  {!message.isRead && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Unread
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(message.createdAt)}
                </span>
              </div>

              <p className="text-sm text-gray-800 mb-2">{message.message}</p>

              <div className="text-xs text-gray-500">
                Sent to: <span className="font-medium">Intern ID {message.internId.substring(0, 8)}</span>
                {message.isRead && message.readAt && (
                  <span className="ml-3">
                    • Read {formatDate(message.readAt)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

MessagesList.propTypes = {
  adminId: PropTypes.string.isRequired,
};

export default MessagesList;