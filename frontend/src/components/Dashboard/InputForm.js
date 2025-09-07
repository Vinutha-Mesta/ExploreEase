import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Users, Utensils, Mountain } from 'lucide-react';

const InputForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    days: '',
    destination: '',
    budget: '',
    people: '',
    preferences: []
  });

  const preferencesOptions = [
    'Adventure', 'Cultural', 'Food', 'Nature', 'Shopping', 'Relaxation', 'Historical'
  ];

  const handlePreferenceToggle = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Plan Your Perfect Trip
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-5 h-5 mr-2 text-primary-600" />
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              max="30"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="How many days?"
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: e.target.value })}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-5 h-5 mr-2 text-primary-600" />
              Destination
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Where do you want to go?"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline-block w-5 h-5 mr-2 text-primary-600" />
              Budget (per person)
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            >
              <option value="">Select budget range</option>
              <option value="$">Budget ($0-$50/day)</option>
              <option value="$$">Moderate ($50-$150/day)</option>
              <option value="$$$">Luxury ($150+/day)</option>
            </select>
          </div>

          {/* People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline-block w-5 h-5 mr-2 text-primary-600" />
              Number of People
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="How many travelers?"
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: e.target.value })}
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Utensils className="inline-block w-5 h-5 mr-2 text-primary-600" />
            Interests & Preferences
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {preferencesOptions.map((preference) => (
              <button
                key={preference}
                type="button"
                onClick={() => handlePreferenceToggle(preference)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  formData.preferences.includes(preference)
                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Itinerary...
            </>
          ) : (
            'Generate Itinerary'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm; 
