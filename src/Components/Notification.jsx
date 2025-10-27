import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../store/notification/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
  const { message, type, visible } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white shadow-lg ${getBgColor()}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
