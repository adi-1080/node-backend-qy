import express from "express";
import passport from "passport";
import { Strategy as AppleStrategy } from "passport-apple";
import session from "express-session";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import fs from "fs"; // For loading private key

dotenv.config();

const app = express();

// Load sensitive data from .env file
const {
  APPLE_CLIENT_ID,
  APPLE_TEAM_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY_PATH, // Path to the private key (instead of storing in .env)
  APPLE_CALLBACK_URL,
  SESSION_SECRET,
} = process.env;

// Load the private key from the specified path
const privateKey = fs.readFileSync(APPLE_PRIVATE_KEY_PATH, "utf8");

// Function to generate the client secret (JWT) using the private key
const generateClientSecret = () => {
  return jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d",
    audience: "https://appleid.apple.com",
    issuer: APPLE_TEAM_ID,
    subject: APPLE_CLIENT_ID,
  });
};

// Set up secure session management
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Apply rate limiting globally or for specific routes

// Rate limiting configuration: Max 5 requests per 15 minutes for the entire app
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the global rate limiter to all routes
app.use(globalLimiter);

// Passport Apple authentication setup
passport.use(
  new AppleStrategy(
    {
      clientID: APPLE_CLIENT_ID,
      teamID: APPLE_TEAM_ID,
      keyID: APPLE_KEY_ID,
      privateKey: privateKey, // Use the private key loaded from the file
      clientSecret: generateClientSecret(),
      callbackURL: APPLE_CALLBACK_URL, // The callback URL to handle after authentication
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// Route to serve the login page
app.get("/login", (req, res) => {
  res.send('<a href="/auth/apple">Sign in with Apple</a>');
});

// Rate limit for /auth/apple route (optional)
const appleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit requests to 3 per 15 minutes
  message: "Too many authentication attempts, please try again later.",
});

app.get("/auth/apple", appleAuthLimiter, passport.authenticate("apple"));

app.get(
  "/auth/apple/callback",
  appleAuthLimiter,
  passport.authenticate("apple", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Dashboard route (example of a secure route)
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.send("Welcome to your Dashboard!");
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.redirect("/");
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});