import { useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';

const AlertListener = () => {
  const { getUnresolvedAlerts } = useData();
  const previousAlertCount = useRef(0);

  useEffect(() => {
    // Request notification permission once
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const alerts = getUnresolvedAlerts();
      if (alerts.length > previousAlertCount.current) {
        const newAlert = alerts[0];
        showNotification(newAlert.message);
        previousAlertCount.current = alerts.length;
      } else {
        previousAlertCount.current = alerts.length;
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification('⚠️ Health Alert', {
        body: message,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIA...', // optional: add a favicon path or use default
      });
    }
  };

  return null; // this component doesn't render anything
};

export default AlertListener;
