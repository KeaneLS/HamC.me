import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Redirect to the intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        if (currentUser?.photoURL) {
          setProfileImage(`${currentUser.photoURL}?${new Date().getTime()}`);
        }
      } else {
        setProfileImage(null);
      }
      setLoading(false);
      setIsSigningIn(false);
    });

    return () => {
      unsubscribe();
      setIsSigningIn(false);
    };
  }, [navigate, location]);

  const handleLogin = async () => {
    setError(null);
    
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      await signInWithPopup(auth, provider);
      
    } catch (error) {
      console.error("Login error:", error);
      setIsSigningIn(false);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Previous sign-in still in progress');
      } else {
        setError(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProfileImage(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  const ProfilePlaceholder = () => (
    <div className="w-20 h-20 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
      <span className="text-2xl font-bold text-gray-500">
        {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Login Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!user ? (
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Protected by Google</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>By signing in, you agree to our</p>
              <div className="mt-1">
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}&{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user.displayName || 'Profile'}
                className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                onError={(e) => {
                  console.error('Profile image failed to load');
                  setProfileImage(null);
                }}
              />
            ) : (
              <ProfilePlaceholder />
            )}
            <div className="space-y-2">
              <p className="font-medium text-gray-800">{user.displayName}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-white text-sm">
        <p>© 2024 Spyware. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;