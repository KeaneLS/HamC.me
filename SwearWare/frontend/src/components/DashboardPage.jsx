import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import SwearList from './SwearList';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Volume2, Ban, Clock, RefreshCcw, LogOut, User, DollarSign, Edit2, Save, X, PlusCircle, Trash2 } from 'lucide-react';

const DashboardPage = ({ inputId }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingCost, setEditingCost] = useState(null);
  const [swearStats, setSwearStats] = useState({});
  const [totalSwears, setTotalSwears] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [mostUsed, setMostUsed] = useState("Fuck");
  const [swearData, setSwearData] = useState();
  const [weeklyData, setWeeklyData] = useState([
    { day: "Mon", count: 12 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 15 },
    { day: "Fri", count: 22 },
    { day: "Sat", count: 6 },
    { day: "Sun", count: 10 },
  ]);
  const [accountData, setAccountData] = useState({
    accountBalance: 45,
    individualUsers: ["Bob", "Alice", "Cindy", "David", "Elen"],
    individualUsersBalances: [21, 34, 53, 2, 64],
    recentSwears: ["fuck", "shit", "damn", "fuck", "fuck"],
  });
  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const addSwearWord = async (word, cost) => {
    const response = await fetch('http://localhost:5000/add-swear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word, cost }), 
    });
  
    if (!response.ok) {
      throw new Error('Failed to add swear word');
    }
  
    const data = await response.json();
    console.log(word, cost);
    console.log('Response from server:', data);
  };



  const deleteSwearWord = async (word) => {
    const response = await fetch('http://localhost:5000/delete-swear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }), 
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete swear word');
    }
  
    const data = await response.json();
    console.log('Response from server:', data);
  };
  const setCost = async (word, cost) => {
    const response = await fetch('http://localhost:5000/set-cost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word, cost }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add swear word');
    }
  
    const data = await response.json();
    console.log('Response from server:', data);
  };
  const handleAddSwearWord = () => {
    addSwearWord(newWord,0);
    if (newWord.trim() && !swearStats[newWord.trim().toLowerCase()]) {
      setSwearStats((prev) => ({
        ...prev,
        [newWord.trim().toLowerCase()]: { count: 0, cost: 0 },
      }));
      setNewWord("");
    }
  };

  const handleDeleteSwearWord = (word) => {
    deleteSwearWord(word);
    setSwearStats((prev) => {
      const updatedStats = { ...prev };
      delete updatedStats[word];
      return updatedStats;
    });
  };

  const handleCostChange = (word, value) => {
    const newCost = parseFloat(value);
    setCost(word,newCost);
    if (!isNaN(newCost) && newCost >= 0) {
      setSwearStats((prev) => ({
        ...prev,
        [word]: {
          ...prev[word],
          cost: newCost,
        },
      }));
    }
  };

  // Calculate total cost
  
  useEffect(() => {
    const totalCost = Object.entries(swearStats || {}).reduce((total, [_, stats]) => {
      return total + (stats.count || 0) * (stats.cost || 0);
    }, 0); // Ensure an initial value of 0
    setTotalCost(totalCost);
  }, [swearStats]);

  useEffect(() => {
    const totalSwears = Object.entries(swearStats || {}).reduce((total, [_, stats]) => {
      return total + (stats.count || 0);
    }, 0); // Ensure an initial value of 0
    setTotalSwears(totalSwears);
  }, [swearStats]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  

  const fetchSwearLinks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/swear-log/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch swear log');
      }

      const data = await response.json();
      setSwearData(data);
      console.log('Swear Links:', data);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const setSwearStat = useCallback((newStats) => {
    setSwearStats((prevStats) => ({
      ...prevStats,
      ...newStats,
    }));
  }, []);

  useEffect(() => {
    const fetchSwearStats = async () => {
      setLoading(true);
      try {
        await fetchSwearLinks();

        const response = await fetch(`http://localhost:5000/swear-list/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch swear list: ${response.statusText}`);
        }
        const data = await response.json();
        const transformedData = data.reduce((acc, item) => {
          acc[item.word] = {
            count: item.number_of_times_said || 0,
            cost: item.cost || 0,
          };
          return acc;
        }, {});
        setSwearStat(transformedData);

        const accountResponse = await fetch(`http://localhost:5000/account-data/`);
        if (!accountResponse.ok) {
          throw new Error(`Failed to fetch account data: ${accountResponse.statusText}`);
        }
        const accountData = await accountResponse.json();
        setAccountData({
          accountBalance: accountData.accountBalance,
          individualUsers: accountData.individualUsers,
          individualUsersBalances: accountData.individualUsersBalances,
          recentSwears: accountData.recentSwears,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSwearStats();
  }, [inputId, fetchSwearLinks, setSwearStat]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  
  const previousTotal = 105;
  const percentageChange = ((totalSwears - previousTotal) / previousTotal) * 100;


  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-blue-100 mt-1">Welcome back, {}{user.displayName}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title="Refresh"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
              ) : (
                <User className="w-8 h-8 p-1 rounded-full border-2 border-white/50" />
              )}
              <span className="hidden md:inline">{user.displayName}</span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add a new stats card for total cost */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Swears</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {totalSwears}
                </h2>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {percentageChange > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500 text-sm font-medium">+{percentageChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">{percentageChange.toFixed(1)}%</span>
                </>
              )}
              <span className="text-gray-600 text-sm ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Most Used</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent capitalize">
                  {/*{Object.entries(swearStats).reduce((a, b) => a[1].count > b[1].count ? a : b)[0]}*/}
                </h2>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm font-medium">
              Used {Math.max(...Object.values(swearStats).map(s => s.number_of_times_said))} times this week
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                  ${totalCost.toFixed(2)}
                </h2>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm font-medium">
              Average ${(totalCost / totalSwears).toFixed(2)} per swear
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Clean Streak</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  2 days
                </h2>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm font-medium">
              Personal best: 5 days
            </div>
          </div>
        </div>

        {/* Chart section remains the same */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Updated Detailed Stats with Cost Management */}
         <div className="container mx-auto px-4 py-8">
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 mb-6 w-full max-w-4xl mx-auto">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Swear Words</h3>
    
    <div className="flex items-center space-x-4 mb-4">
      <input
        type="text"
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder="Add a new swear word"
        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAddSwearWord}
        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5" />
      </button>
    </div>
  </div>

  <div className="flex justify-center">
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow w-full max-w-4xl">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Detailed Statistics</h3>
        <div className="text-sm text-gray-500">
          Total Violations: ${Object.entries(swearStats).reduce((total, [_, stats]) => total + (stats.number_of_times_said * stats.cost), 0).toFixed(2)}
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {Object.entries(swearStats).map(([word, stats]) => (
          <div 
            key={word} 
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-1 flex items-center space-x-4">
              <button
                onClick={() => handleDeleteSwearWord(word)}
                className="text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div>
                <h4 className="text-lg font-medium capitalize text-gray-800">{word}</h4>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  {editingCost === word ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={stats.cost}
                        onChange={(e) => handleCostChange(word, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setEditingCost(null)}
                        className="p-1 text-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCost(null)}
                        className="p-1 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${stats.cost.toFixed(2)}
                      </span>
                      <span className="text-gray-500">×</span>
                      <span className="text-lg font-bold text-gray-900">
                        {stats.count}
                      </span>
                      <button
                        onClick={() => setEditingCost(word)}
                        className="p-1 text-gray-400 hover:text-gray-600 group-hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Total: ${(stats.count * stats.cost).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
      </main>
      <div>
      <SwearList swearData={swearData} />
    </div>
    </div>
  );
};

export default DashboardPage;