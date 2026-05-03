const express = require("express");
const app = express();

const detectScam = require("./logic/scamDetector");
const { detectManipulation } = require("./logic/manipulationDetector");
const { decideAction } = require("./logic/decisionHelper");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🎯 FINAL TYPE ENGINE (SMART 🔥)
function getFinalResultType(scam, manipulation) {

  // HARD SAFE (no signal at all)
  if (
    scam.result === "SAFE" &&
    manipulation.manipulationLevel === "LOW" &&
    (!scam.signals || scam.signals.length === 0)
  ) {
    return "SAFE";
  }

  // HIGH RISK
  if (
    scam.result === "DANGEROUS" ||
    manipulation.manipulationLevel === "HIGH" ||
    (scam.riskScore >= 60)
  ) {
    return "DANGEROUS";
  }

  // DEFAULT
  return "SUSPICIOUS";
}

// 🎯 Merge Signals
function mergeSignals(scamSignals = [], manipulationSignals = []) {
  return [...new Set([...scamSignals, ...manipulationSignals])];
}

// 🎯 Merge Advice
function mergeAdvice(scamAdvice = [], manipulationAdvice = []) {
  return [...new Set([...scamAdvice, ...manipulationAdvice])];
}

// 🎯 AI EXPLANATION BUILDER (NO TEMPLATE 🔥)
function buildExplanation(type, scam, manipulation) {

  let parts = [];

  // SCAM SIDE
  if (scam.humanMessage && scam.humanMessage.trim() !== "") {
    parts.push(scam.humanMessage.trim());
  }

  // MANIPULATION SIDE
  if (
    manipulation.manipulationMessage &&
    manipulation.manipulationLevel !== "LOW"
  ) {
    parts.push(manipulation.manipulationMessage.trim());
  }

  // EXTRA INTELLIGENCE LINE
  if (type === "DANGEROUS") {
    parts.push(
      "👉 Yeh combination (fear, urgency, ya lalach) usually scam messages me use hota hai taaki aap bina soche react karein."
    );
  }

  return parts.join("\n\n");
}

// API route
app.post("/check", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔍 Run engines
    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);
    const decision = decideAction(scamResult, manipulationResult);

    // 🎯 FINAL TYPE
    const finalType = getFinalResultType(scamResult, manipulationResult);

    // 🎯 CLEAN DATA
    const signals = mergeSignals(
      scamResult.signals,
      manipulationResult.signals
    );

    const advice = mergeAdvice(
      scamResult.advice,
      manipulationResult.manipulationAdvice
    );

    // 🎯 RESPONSE OBJECT
    let response = {
      type: finalType,
      finalMessage: "",
      explanation: "",
      signals,
      advice,
      decision
    };

    // =========================
    // 🟢 SAFE
    // =========================
    if (finalType === "SAFE") {

      response.finalMessage = "✅ Yeh message safe lag raha hai.";

      response.explanation =
        "Koi strong scam ya manipulation signal detect nahi hua.\n\n👉 Aap ise normal conversation ki tarah treat kar sakte hain.";
    }

    // =========================
    // 🟡 SUSPICIOUS
    // =========================
    else if (finalType === "SUSPICIOUS") {

      response.finalMessage = "⚠️ Yeh message suspicious lag raha hai.";

      response.explanation = buildExplanation(
        "SUSPICIOUS",
        scamResult,
        manipulationResult
      );
    }

    // =========================
    // 🔴 DANGEROUS
    // =========================
    else {

      response.finalMessage = "🚨 Yeh message risky / scam ho sakta hai.";

      response.explanation = buildExplanation(
        "DANGEROUS",
        scamResult,
        manipulationResult
      );
    }

    // ✅ SEND FINAL
    res.json(response);

  } catch (error) {
    console.error("❌ Server Error:", error);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});


// =========================
// 📊 FEEDBACK API (NEW ADD)
// =========================
app.post("/feedback", (req, res) => {
  try {
    const { message, feedback } = req.body;

    console.log("📊 USER FEEDBACK:");
    console.log("Message:", message);
    console.log("Feedback:", feedback);
    console.log("------------------------");

    res.json({ status: "saved" });

  } catch (error) {
    console.error("❌ Feedback Error:", error);
    res.status(500).json({ error: "Feedback failed" });
  }
});


// =========================
// 🚨 REPORT WRONG RESULT (NEW ADD)
// =========================
app.post("/report", (req, res) => {
  try {
    const { message } = req.body;

    console.log("🚨 WRONG DETECTION REPORTED:");
    console.log("Message:", message);
    console.log("------------------------");

    res.json({ status: "reported" });

  } catch (error) {
    console.error("❌ Report Error:", error);
    res.status(500).json({ error: "Report failed" });
  }
});


// =========================
// 🧠 DEBUG ROUTE (OPTIONAL ADD)
// =========================
app.post("/debug", (req, res) => {
  try {
    const { message } = req.body;

    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);

    console.log("🧠 DEBUG DATA:");
    console.log("Message:", message);
    console.log("Scam:", scamResult);
    console.log("Manipulation:", manipulationResult);
    console.log("------------------------");

    res.json({
      scam: scamResult,
      manipulation: manipulationResult
    });

  } catch (error) {
    console.error("❌ Debug Error:", error);
    res.status(500).json({ error: "Debug failed" });
  }
});


// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Truvexa running on port " + PORT);
});
