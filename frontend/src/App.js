import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Layout/Header';
import InputForm from './components/Dashboard/InputForm';
import ItineraryCard from './components/Dashboard/ItineraryCard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { itineraryAPI } from './services/api';
import { generatePDF } from './services/itineraryService';
import { Download } from 'lucide-react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login onToggleAuth={() => setIsLogin(false)} />
      ) : (
        <Register onToggleAuth={() => setIsLogin(true)} />
      )}
    </>
  );
}

function Dashboard() {
  const [itinerary, setItinerary] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateItinerary = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await itineraryAPI.generate(formData);
      setItinerary(response.data.itinerary);
      setUserInput(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    generatePDF(itinerary, userInput);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!itinerary ? (
          <InputForm onSubmit={handleGenerateItinerary} loading={loading} />
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Your {userInput.days}-Day Itinerary for {userInput.destination}
              </h2>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setItinerary(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Plan New Trip
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itinerary.map((place, index) => (
                <ItineraryCard key={place.id} place={place} index={index} />
              ))}
            </div>

            {itinerary.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No places found matching your criteria.</p>
                <p className="text-gray-400">Try adjusting your preferences or destination.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 
