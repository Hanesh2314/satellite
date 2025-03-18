import { useCallback } from "react";
import { useLocation } from "wouter";

const ConfirmationPage = () => {
  const [, navigate] = useLocation();

  const handleConfirm = useCallback(() => {
    navigate("/departments");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 page-transition active">
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold text-star-white mb-6">
          Are you serious about joining our research satellite team?
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          It's not about what you already know—it's about your willingness to learn, adapt, and put in the work. We're building something big, a research satellite, and we need people who are ready to commit. If you're willing to push limits and grow, let's talk.
        </p>
        <p className="text-2xl font-bold text-stellar-yellow">
          Are you in?
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="bg-stellar-yellow hover:bg-yellow-500 text-deep-blue font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        Yes, I'm Ready to Commit!
        <span className="ml-2">🚀</span>
      </button>
    </div>
  );
};

export default ConfirmationPage;
