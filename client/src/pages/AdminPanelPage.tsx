import { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

const AdminPanelPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-12 page-transition active">
      {!isLoggedIn ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default AdminPanelPage;
