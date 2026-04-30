const express = require("express");
const app = express();

const detectScam = require("./logic/scamDetector");
const { detectManipulation } = require("./logic/manipulationDetector");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🎯 Helper: Decide FINAL TYPE
function getFinalResultType(scam, manipulation) {
  if (scam.result === "SAFE" && manipulation.manipulationLevel === "LOW") {
    return "SAFE";
  }

  if (
    scam.result === "DANGEROUS" ||
    manipulation.manipulationLevel === "HIGH"
  ) {
    return "DANGEROUS";
  }

  return "SUSPICIOUS";
}

// 🎯 Helper: Merge + Clean Signals
function mergeSignals(scamSignals = [], manipulationSignals = []) {
  return [...new Set([...scamSignals, ...manipulationSignals])];
}

// 🎯 Helper: Merge + Remove duplicate advice
function mergeAdvice(scamAdvice = [], manipulationAdvice = []) {
  return [...new Set([...scamAdvice, ...manipulationAdvice])];
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

    // 🔍 Run detectors
    const scamResult = detectScam(message);
    const manipulationResult = detectManipulation(message);

    // 🎯 FINAL DECISION ENGINE
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

    // 🎯 SMART RESPONSE (AI feel)
    let response = {
      type: finalType,
      finalMessage: "",
      explanation: "",
      signals,
      advice
    };

    // 🟢 SAFE RESPONSE (Clean)
    if (finalType === "SAFE") {
      response.finalMessage = "✅ Yeh message safe lag raha hai.";
      response.explanation =
        "Koi strong scam ya manipulation signal detect nahi hua. Aap bina tension ke isse normal treat kar sakte hain.";
    }

    // 🟡 SUSPICIOUS RESPONSE
    else if (finalType === "SUSPICIOUS") {
      response.finalMessage = "⚠️ Yeh message suspicious lag raha hai.";

      response.explanation = `
Is message me kuch aise patterns mile jo aapko confuse ya jaldi decision lene par majboor kar sakte hain.

${scamResult.humanMessage || ""}
${manipulationResult.manipulationMessage || ""}
      `.trim();
    }

    // 🔴 DANGEROUS RESPONSE
    else {
      response.finalMessage = "🚨 Yeh message risky / scam ho sakta hai.";

      response.explanation = `
Is message me strong manipulation ya scam signals detect hue hain.

${scamResult.humanMessage || ""}
${manipulationResult.manipulationMessage || ""}

Yeh message aapko emotionally control karne ki koshish kar raha hai (jaise dar, lalach ya urgency create karke).
      `.trim();
    }

    // ✅ FINAL JSON
    res.json(response);

  } catch (error) {
    console.error("❌ Server Error:", error);

    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Truvexa running on port " + PORT);
});
