const express = require("express");
const app = express();

const detectScam = require("./logic/scamDetector");

const { detectManipulation } = require("./logic/manipulationDetector");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API route
app.post("/check", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔍 Run detectors
    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);

    // ✅ SAFE MERGE (no overwrite risk)
    const finalResult = {
      scam: scamResult,
      manipulation: manipulationResult
    };

    res.json(finalResult);

  } catch (error) {
    console.error("❌ Server Error:", error);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

// ✅ PORT FIX (Replit stable)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Truvexa running on port " + PORT);
});
