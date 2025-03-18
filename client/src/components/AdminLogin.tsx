import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  const handleLogin = () => {
    // Check if password is KLPD
    if (password === "KLPD") {
      setError(false);
      onLogin(true);
    } else {
      setError(true);
      onLogin(false);
    }
  };
  
  return (
    <div className="w-full max-w-md bg-deep-blue bg-opacity-70 p-8 rounded-xl backdrop-filter backdrop-blur-lg border border-satellite-blue border-opacity-50 text-center">
      <h2 className="text-3xl font-bold text-star-white mb-6">Admin Panel</h2>
      <p className="text-gray-300 mb-6">Enter password to access the admin panel</p>
      
      <div className="space-y-4">
        <Input
          type="password"
          id="admin-password"
          className="w-full px-4 py-3 bg-space-black bg-opacity-50 rounded-lg border border-satellite-blue focus:border-stellar-yellow text-white"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        
        <Button
          className="w-full bg-cosmic-purple hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition-colors"
          onClick={handleLogin}
        >
          Login
        </Button>
        
        {error && (
          <p className="text-red-500">Incorrect password. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
