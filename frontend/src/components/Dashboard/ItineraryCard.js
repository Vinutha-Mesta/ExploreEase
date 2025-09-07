import React from 'react';
import { MapPin, Star, Clock, DollarSign, ExternalLink } from 'lucide-react';

const ItineraryCard = ({ place, index }) => {
  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold mr-3">
            {index + 1}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{place.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          place.isOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {place.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Star className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-sm">Rating: {place.rating} / 5</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm">Budget: {place.budget}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm">{place.visitDuration}</span>
        </div>
        
        <div className="text-sm text-gray-600">
          <strong>Recommended time:</strong> {place.recommendedTime}
        </div>
      </div>

      <div className="flex space-x-3">
        <a
          href={getGoogleMapsUrl(place.coordinates.lat, place.coordinates.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </a>
        
        <a
          href={getGoogleMapsUrl(place.coordinates.lat, place.coordinates.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Directions
        </a>
      </div>
    </div>
  );
};

export default ItineraryCard; 
