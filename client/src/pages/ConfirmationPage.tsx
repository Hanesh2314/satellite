import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "wouter";

const ConfirmationPage = () => {
  const [, navigate] = useLocation();
  const params = useParams();
  const applicationId = params?.id;

  const handleConfirm = useCallback(() => {
    navigate("/departments");
  }, [navigate]);

  // Use application ID if it's in the URL
  useEffect(() => {
    console.log("Application submitted successfully with ID:", applicationId);
  }, [applicationId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 page-transition active">
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Thank You for Your Application!
        </h2>
        <p className="text-xl text-white mb-6">
          Your application has been successfully submitted. Our team will review your information and contact you soon.
        </p>
        <p className="text-xl text-gray-300 mb-8">
          Application ID: <span className="font-mono bg-deep-blue px-2 py-1 rounded">{applicationId || "Unknown"}</span>
        </p>
        <p className="text-2xl font-bold text-stellar-yellow mb-8">
          Ready to explore more?
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="bg-stellar-yellow hover:bg-yellow-500 text-deep-blue font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        Explore Departments
        <span className="ml-2">🚀</span>
      </button>
    </div>
  );
};

export default ConfirmationPage;
