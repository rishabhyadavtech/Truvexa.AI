const express = require("express");
const app = express();

const detectScam = require("./logic/scamDetector"); // ✅ FIX

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API route
app.post("/check", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ error: "Message is required" }); // ✅ FIX
  }

  const result = detectScam(message);
  res.json(result);
});

// ✅ PORT FIX (Replit stable)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Truvexa running on port " + PORT);
});
