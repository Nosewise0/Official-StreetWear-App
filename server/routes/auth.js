const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || "" } },
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.message, code: error.code });
  }

  return res.status(201).json({
    success: true,
    user: data.user,
    access_token: data.session?.access_token ?? null,
    refresh_token: data.session?.refresh_token ?? null,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ success: false, message: error.message, code: error.code });
  }

  return res.json({
    success: true,
    user: data.user,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    await supabase.auth.admin?.signOut(token).catch(() => {});
  }

  return res.json({ success: true, message: "Logged out." });
});

router.post("/reset-password", async (req, res) => {
  const { email, redirectTo } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${process.env.CLIENT_URL}/reset-password`,
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.json({ success: true, message: "Password reset email sent." });
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }

  return res.json({ success: true, user: data.user });
});

module.exports = router;
