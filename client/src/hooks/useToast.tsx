import { useState } from 'react';
import { useToast as useShadcnToast } from '@/hooks/use-toast';

export const useCustomToast = () => {
  const { toast } = useShadcnToast();
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setIsVisible(true);
    
    let variant: 'default' | 'destructive' = 'default';
    if (type === 'error') variant = 'destructive';
    
    toast({
      title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information',
      description: message,
      variant: variant,
    });

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return { showToast, isVisible };
};
