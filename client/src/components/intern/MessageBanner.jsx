import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { subscribeToInternMessages, markMessageAsRead } from '../../services/firestore.service';
import Alert from '../common/Alert';

const MessageBanner = ({ internId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!internId) return;

    const unsubscribe = subscribeToInternMessages(internId, (fetchedMessages) => {
      // Only show unread messages
      const unreadMessages = fetchedMessages.filter(msg => !msg.isRead);
      setMessages(unreadMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [internId]);

  const handleDismiss = async (messageId) => {
    await markMessageAsRead(messageId);
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  if (loading || messages.length === 0) {
    return null;
  }

  const getPriorityType = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {messages.map((message) => (
        <Alert
          key={message.id}
          type={getPriorityType(message.priority)}
          message={message.message}
          onClose={() => handleDismiss(message.id)}
        />
      ))}
    </div>
  );
};

MessageBanner.propTypes = {
  internId: PropTypes.string.isRequired,
};

export default MessageBanner;