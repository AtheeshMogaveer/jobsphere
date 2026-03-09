const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================================
// REGISTER
// POST /api/auth/register
// ================================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // 2. Check if email already exists
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // 3. Hash the password
    // The "10" is the salt rounds — how many times it scrambles
    // More rounds = more secure but slower
    // 10 is the industry standard balance
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user to database
    const newUser = await db.query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email.toLowerCase(), hashedPassword],
    );

    const user = newUser.rows[0];

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // payload (data inside token)
      process.env.JWT_SECRET, // secret key to sign it
      { expiresIn: "7d" }, // token expires in 7 days
    );

    // 6. Return token and user info
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// ================================
// LOGIN
// POST /api/auth/login
// ================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // 2. Find user by email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      // Don't say "email not found" — that reveals which emails are registered
      // Always say generic message for security
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // 3. Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 5. Return token (never return the password!)
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error FULL:", error); // Changed this line
    res.status(500).json({ error: error.message }); // Changed this line
  }
};

// ================================
// GET CURRENT USER
// GET /api/auth/me
// ================================
const getMe = async (req, res) => {
  try {
    // req.userId comes from auth middleware (next step)
    const result = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get me error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, getMe };
