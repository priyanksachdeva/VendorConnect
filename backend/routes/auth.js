const express = require("express");
const router = express.Router();

// Mock user data for testing
const mockUsers = [
  {
    id: "user_1",
    email: "test@example.com",
    password: "password123", // In real app, this would be hashed
    name: "Test User",
    role: "supplier",
  },
  {
    id: "user_2",
    email: "vendor@example.com",
    password: "vendor123",
    name: "Vendor User",
    role: "vendor",
  },
  {
    id: "user_3",
    email: "testuser@gmail.com",
    password: "testpassword",
    name: "Test User Gmail",
    role: "supplier",
  },
  {
    id: "user_4",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "user_5",
    email: "officialbadluckguy@gmail.com",
    password: "priyank2005",
    name: "Priyank Sachdeva",
    role: "vendor",
  },
];

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: `mock_token_${user.id}_${Date.now()}`, // Mock JWT token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role = "vendor" } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, hash this
      name,
      role,
    };

    mockUsers.push(newUser);

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
      token: `mock_token_${newUser.id}_${Date.now()}`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Verify token endpoint
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Mock token validation (in real app, verify JWT)
    if (token.startsWith("mock_token_")) {
      const userId = token.split("_")[2];
      const user = mockUsers.find((u) => u.id === userId);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
          success: true,
          user: userWithoutPassword,
        });
      }
    }

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
