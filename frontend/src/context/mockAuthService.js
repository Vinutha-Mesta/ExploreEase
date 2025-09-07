// Create a mock service to simulate backend API calls
const mockAuthService = {
  // Mock users stored in localStorage
  getUsers: () => {
    const users = localStorage.getItem('mockUsers');
    return users ? JSON.parse(users) : [];
  },
  
  // Save users to localStorage
  saveUsers: (users) => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  },
  
  // Mock login function
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = mockAuthService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Return a mock token and user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return {
      token: `mock-jwt-token-${user.id}`,
      user: userWithoutPassword
    };
  },
  
  // Mock registration function
  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = mockAuthService.getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    mockAuthService.saveUsers(users);
    
    // Return a mock token and user data (without password)
    const { password, ...userWithoutPassword } = newUser;
    return {
      token: `mock-jwt-token-${newUser.id}`,
      user: userWithoutPassword
    };
  },
  
  // Mock token verification
  verifyToken: async (token) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract user ID from token
    const userId = token.replace('mock-jwt-token-', '');
    const users = mockAuthService.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Invalid token');
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
};

export default mockAuthService;