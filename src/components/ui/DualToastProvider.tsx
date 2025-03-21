
import { Toaster } from '@/components/ui/sonner';
import { ToastContainer } from '@/components/notifications/ToastContainer';

// This component allows us to use both sonner and react-toastify
export const DualToastProvider = () => {
  return (
    <>
      <Toaster />
      <ToastContainer />
    </>
  );
};
