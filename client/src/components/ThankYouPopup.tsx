import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  redirectDelay?: number; // Time in seconds before auto-redirect
}
const ThankYouPopup: React.FC<ThankYouPopupProps> = ({
  isOpen,
  onClose,
  redirectDelay = 5,
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(redirectDelay);
  // Set up countdown timer when popup is open
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(redirectDelay);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, navigate, onClose, redirectDelay]);
  // Handle immediate redirect
  const handleGoHome = () => {
    onClose();
    navigate("/");
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <DialogTitle className="text-xl text-center">Application Submitted!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for your interest in SpaceTechHub. Your application has been
            received and is being processed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-center">
          <p>We appreciate your interest in joining our team.</p>
          <p>You will be contacted if your profile matches our requirements.</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page in {timeLeft} seconds...
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleGoHome} className="w-full">
            Return to Home Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ThankYouPopup;
