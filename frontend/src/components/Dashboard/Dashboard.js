function Dashboard() {
  const [itinerary, setItinerary] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateItinerary = async (formData) => {
    setLoading(true);
    setError('');
    setResponseData(null);
    
    try {
      const response = await itineraryAPI.generate(formData);
      setItinerary(response.data.itinerary);
      setUserInput(formData);
      setResponseData(response.data);
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
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Your {userInput.days}-Day Itinerary for {userInput.destination}
                </h2>
                {responseData && responseData.suggestions && responseData.suggestions.length > 0 && (
                  <div className="mt-2 text-gray-600">
                    {responseData.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-sm italic">{suggestion}</p>
                    ))}
                  </div>
                )}
              </div>
              
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

            {itinerary.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    No exact matches found for "{userInput.destination}"
                  </h3>
                  <p className="text-yellow-700">
                    But don't worry! Here are some popular attractions from major cities that you might enjoy:
                  </p>
                </div>
                
                <button
                  onClick={() => setItinerary(null)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Try a Different Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.map((place, index) => (
                  <ItineraryCard key={place.id} place={place} index={index} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}