const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Mock data
const mockPlaces = [
  // Delhi
  {
    id: 1,
    name: "India Gate",
    city: "Delhi",
    rating: 4.6,
    budget: "$",
    type: "Monument",
    coordinates: { lat: 28.6129, lng: 77.2295 }
  },
  {
    id: 2,
    name: "Red Fort",
    city: "Delhi",
    rating: 4.5,
    budget: "$$",
    type: "Historical",
    coordinates: { lat: 28.6562, lng: 77.2410 }
  },
  {
    id: 3,
    name: "Lotus Temple",
    city: "Delhi",
    rating: 4.7,
    budget: "$",
    type: "Religious",
    coordinates: { lat: 28.5535, lng: 77.2588 }
  },

  // Agra
  {
    id: 4,
    name: "Taj Mahal",
    city: "Agra",
    rating: 4.9,
    budget: "$$$",
    type: "Historical",
    coordinates: { lat: 27.1751, lng: 78.0421 }
  },
  {
    id: 5,
    name: "Agra Fort",
    city: "Agra",
    rating: 4.6,
    budget: "$$",
    type: "Historical",
    coordinates: { lat: 27.1790, lng: 78.0211 }
  },

  // Jaipur
  {
    id: 6,
    name: "Amber Fort",
    city: "Jaipur",
    rating: 4.7,
    budget: "$$",
    type: "Fort",
    coordinates: { lat: 26.9855, lng: 75.8513 }
  },
  {
    id: 7,
    name: "Hawa Mahal",
    city: "Jaipur",
    rating: 4.6,
    budget: "$",
    type: "Palace",
    coordinates: { lat: 26.9239, lng: 75.8267 }
  },

  // Mumbai
  {
    id: 8,
    name: "Gateway of India",
    city: "Mumbai",
    rating: 4.5,
    budget: "$",
    type: "Monument",
    coordinates: { lat: 18.9219, lng: 72.8347 }
  },
  {
    id: 9,
    name: "Marine Drive",
    city: "Mumbai",
    rating: 4.6,
    budget: "$",
    type: "Landmark",
    coordinates: { lat: 18.9430, lng: 72.8238 }
  },

  // Bengaluru
  {
    id: 10,
    name: "Lalbagh Botanical Garden",
    city: "Bengaluru",
    rating: 4.6,
    budget: "$",
    type: "Garden",
    coordinates: { lat: 12.9507, lng: 77.5848 }
  },
  {
    id: 11,
    name: "Bangalore Palace",
    city: "Bengaluru",
    rating: 4.5,
    budget: "$$",
    type: "Palace",
    coordinates: { lat: 12.9987, lng: 77.5920 }
  },

  // Varanasi
  {
    id: 12,
    name: "Kashi Vishwanath Temple",
    city: "Varanasi",
    rating: 4.7,
    budget: "$",
    type: "Religious",
    coordinates: { lat: 25.3100, lng: 82.9730 }
  },
  {
    id: 13,
    name: "Dashashwamedh Ghat",
    city: "Varanasi",
    rating: 4.8,
    budget: "$",
    type: "Cultural",
    coordinates: { lat: 25.3095, lng: 82.9875 }
  },

  // Kerala
  {
    id: 14,
    name: "Alleppey Backwaters",
    city: "Alappuzha",
    rating: 4.7,
    budget: "$$",
    type: "Backwater",
    coordinates: { lat: 9.4981, lng: 76.3388 }
  },
  {
    id: 15,
    name: "Munnar Tea Gardens",
    city: "Munnar",
    rating: 4.8,
    budget: "$$",
    type: "Nature",
    coordinates: { lat: 10.0889, lng: 77.0595 }
  },

  // Goa
  {
    id: 16,
    name: "Baga Beach",
    city: "Goa",
    rating: 4.6,
    budget: "$",
    type: "Beach",
    coordinates: { lat: 15.5586, lng: 73.7550 }
  },
  {
    id: 17,
    name: "Basilica of Bom Jesus",
    city: "Goa",
    rating: 4.7,
    budget: "$",
    type: "Religious",
    coordinates: { lat: 15.5892, lng: 73.8347 }
  },

  // Kashmir
  {
    id: 18,
    name: "Dal Lake",
    city: "Srinagar",
    rating: 4.8,
    budget: "$$",
    type: "Lake",
    coordinates: { lat: 34.0866, lng: 74.7973 }
  },
  {
    id: 19,
    name: "Shankaracharya Temple",
    city: "Srinagar",
    rating: 4.7,
    budget: "$",
    type: "Religious",
    coordinates: { lat: 34.0900, lng: 74.7980 }
  }
];


// Helper functions
const readUsers = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const users = await readUsers();
    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword, name };
    users.push(newUser);
    await writeUsers(users);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/generate-itinerary', (req, res) => {
  const { days, destination, budget, people, preferences } = req.body;
  
  // Mock itinerary generation logic
  const itinerary = mockPlaces
    .filter(place => place.city.toLowerCase().includes(destination.toLowerCase()))
    .slice(0, 5)
    .map(place => ({
      ...place,
      isOpen: Math.random() > 0.3, // Random open/closed status
      visitDuration: '2-3 hours',
      recommendedTime: '9:00 AM - 12:00 PM'
    }));

  res.json({ itinerary });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
