const express =require("express") ;
const bcrypt =require( "bcryptjs");
const jwt=require( "jsonwebtoken");
const pool =require ("../config/db.js");
const{ protect } =require("../middleware/auth.js");

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );

  const token = generateToken(newUser.rows[0].id);
  res.cookie("token", token, cookieOptions);

  return res.status(201).json({ user: newUser.rows[0] });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(userData.id);
  res.cookie("token", token, cookieOptions);

  return res.json({
    user: { id: userData.id, name: userData.name, email: userData.email },
  });
});

// Me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  return res.json({ message: "Logged out successfully" });
});

module.exports = router;