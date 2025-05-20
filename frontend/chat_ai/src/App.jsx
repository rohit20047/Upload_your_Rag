import { useState, useEffect } from 'react';
import AuthContainer from "./components/AuthContainer";
import Enter from "./Enter.jsx";

export default function App() {
  // Track authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Track current page/route
  const [currentPage, setCurrentPage] = useState('login');
  
  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  // Modify AuthContainer to handle successful auth
  const AuthContainerWithCallback = () => {
    // Wrapper function to handle auth success
    const handleAuthSuccess = () => {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    };

    return <AuthContainer onAuthSuccess={handleAuthSuccess} />;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('recentChats');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <AuthContainerWithCallback />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <AuthContainerWithCallback />;
      default:
        return <AuthContainerWithCallback />;
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

// Dashboard component (example protected content)
function Dashboard({ onLogout }) {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-700 text-white px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-purple-800 rounded hover:bg-purple-900 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome to Your Dashboard</h2>
          
          {userData && (
            <div className="mb-6 p-4 bg-purple-50 rounded border border-purple-100">
              <p className="text-gray-700"><span className="font-medium">Email:</span> {userData.email}</p>
              <p className="text-gray-700"><span className="font-medium">User ID:</span> {userData.id}</p>
            </div>
          )} 
          
          <div className="mt-8">
            <Enter email={userData?.email} />
          </div>
        </div>
      </div>
    </div>
  );
}