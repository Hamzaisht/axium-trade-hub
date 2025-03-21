
import { ToastContainer as ReactToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContainer = () => {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface NotificationOptions {
  autoClose?: number | false;
  onClose?: () => void;
}

const notify = (message: string, type: ToastType = 'info', options?: NotificationOptions) => {
  return toast[type](message, options);
};

export const showNotification = {
  info: (message: string, options?: NotificationOptions) => notify(message, 'info', options),
  success: (message: string, options?: NotificationOptions) => notify(message, 'success', options),
  warning: (message: string, options?: NotificationOptions) => notify(message, 'warning', options),
  error: (message: string, options?: NotificationOptions) => notify(message, 'error', options),
  
  // Specialized notifications
  tradeExecuted: (symbol: string, side: 'buy' | 'sell', quantity: number, price: number) => {
    notify(
      `${side === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${symbol} at $${price.toFixed(2)}`,
      'success',
      { autoClose: 3000 }
    );
  },
  
  orderPlaced: (symbol: string, side: 'buy' | 'sell', quantity: number, price: number, orderType: string) => {
    notify(
      `${orderType.toUpperCase()} ${side.toUpperCase()} order placed: ${quantity} ${symbol} at $${price.toFixed(2)}`,
      'info',
      { autoClose: 5000 }
    );
  },
  
  orderCancelled: (symbol: string, orderId: string) => {
    notify(
      `Order for ${symbol} cancelled successfully`,
      'info',
      { autoClose: 3000 }
    );
  },
  
  sentimentChange: (symbol: string, oldScore: number, newScore: number) => {
    const change = newScore - oldScore;
    const direction = change > 0 ? 'up' : 'down';
    
    notify(
      `${symbol} sentiment shifted ${direction} by ${Math.abs(change).toFixed(1)}% to ${newScore.toFixed(1)}%`,
      change > 0 ? 'success' : 'warning',
      { autoClose: 5000 }
    );
  },
  
  anomalyDetected: (symbol: string, type: string, severity: 'low' | 'medium' | 'high') => {
    notify(
      `${severity.toUpperCase()} risk anomaly detected for ${symbol}: ${type}`,
      severity === 'high' ? 'error' : (severity === 'medium' ? 'warning' : 'info'),
      { autoClose: 8000 }
    );
  }
};
