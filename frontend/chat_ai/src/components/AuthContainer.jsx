import { useState } from 'react';
import { SaveChats } from '../utils/services';

// Auth container that switches between login and signup
export default function AuthContainer({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ text: '', isError: false });
  

  const handleAuth = async (email, password) => {
    try {
      setMessage({ text: '', isError: false });
      console.log('Authenticating:', { email, password });
  
      const endpoint = isLogin
        ? 'http://localhost:3000/api/auth/login'
        : 'http://localhost:3000/api/auth/signup';
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Auth response:', data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
  
      // ✅ Store token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
  
        // If login, store user data
        if (isLogin && data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
  
        setMessage({
          text: `${isLogin ? 'Login' : 'Signup'} successful!`,
          isError: false,
        });
  
        // ✅ Call parent callback
        if (onAuthSuccess) {
          onAuthSuccess();
        }
  
        console.log('Authentication successful:', data);
  
        // ✅ Call saved chats API with email
            await SaveChats(email);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage({
        text: error.message || 'An error occurred',
        isError: true,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-purple-700">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Fill in your information to get started'}
          </p>
        </div>
        
        {message.text && (
          <div className={`p-3 rounded ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        {isLogin ? (
          <LoginForm onLogin={handleAuth} />
        ) : (
          <SignupForm onSignup={handleAuth} />
        )}
        
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Login form component
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };
  
  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div>
        <button
          onClick={handleSubmit}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

// Signup form component
function SignupForm({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    onSignup(email, password);
  };
  
  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          required
          className={`mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordError && (
          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
        )}
      </div>
      
      <div>
        <button
          onClick={handleSubmit}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}