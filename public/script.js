async function checkScam() {

  const message = document.getElementById("input").value.trim();
const language =
document.getElementById("language").value;
  const resultBox = document.getElementById("result");
  const loadingBox = document.getElementById("loadingBox");
const riskMeter = document.getElementById("riskMeter");
const confidenceCard = document.getElementById("confidenceCard");

const riskFill = document.getElementById("riskFill");
const riskText = document.getElementById("riskText");

const confidenceFill =
document.getElementById("confidenceFill");

const confidenceText =
document.getElementById("confidenceText");
  const feedbackBox = document.getElementById("feedbackBox");

  if (!message) {
    alert("Please enter a message");
    return;
  }

  // 🔄 Reset UI
  resultBox.className = "result-box";
  resultBox.innerText = "⏳ Checking message...";
  feedbackBox.style.display = "none";

  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message,language })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    const lang =
data.language || "hi";

    const type = data.type;
    const decision = data.decision || {};

    // =========================
    // 🟢 SAFE MODE
    // =========================
    if (type === "SAFE") {
      resultBox.classList.add("safe");

      if (lang === "en") {

resultBox.innerText = `
🟢 Good News — This message appears to be safe.

No strong scam or manipulation patterns were detected.

You can treat this as a normal conversation.

💡 Still, staying cautious online is always a good habit.
`.trim();

}
else {

resultBox.innerText = `
🟢 Good News — Yeh message safe lag raha hai.

Is message me koi bhi strong scam ya manipulation pattern detect nahi hua.

👍 Aap ise normal conversation ki tarah treat kar sakte hain.

💡 Phir bhi online safety ke liye basic caution rakhna smart hota hai.
`.trim();

}

      feedbackBox.style.display = "block";
      return;
    }

    // =========================
    // 🔴 / 🟡 COLOR STATE
    // =========================
    if (type === "DANGEROUS") {
      resultBox.classList.add("danger");
    } else {
      resultBox.classList.add("warning");
    }

    // =========================
    // 🧠 EXPLANATION CLEAN
    // =========================
    let explanation = (data.explanation || "").replace(/\n{3,}/g, "\n\n");
   
    // =========================
// 📊 RISK SCORE
// =========================
let riskBlock = "";

if (typeof data.riskScore === "number") {
  riskBlock = `
----------------------------

📊 Risk Score

${data.riskScore} / 100
  `;
}

// =========================
// 🎯 CONFIDENCE
// =========================
let confidenceBlock = "";

if (typeof data.confidence === "number") {

  let bars = Math.round(data.confidence / 10);

  confidenceBlock = `
----------------------------

🎯 Detection Confidence

${"█".repeat(bars)}${"░".repeat(10-bars)}

${data.confidence}%
  `;
}

// =========================
// 🛡️ SCAM CATEGORY
// =========================
let categoryBlock = "";

if (data.scamCategory) {

  categoryBlock = `
----------------------------

🛡️ Detected Category

${data.scamCategory}
  `;
}

// =========================
// 🔍 EVIDENCE
// =========================
let evidenceBlock = "";

if (data.evidence && data.evidence.length > 0) {

  evidenceBlock =
`
----------------------------

🔍 Evidence Found
`;

  data.evidence.forEach(item => {

    evidenceBlock +=
`
• ${item.title}
Severity : ${item.severity}
Confidence : ${item.confidence}%
`;
  });

  }
    // =========================
    // 🎯 DECISION BLOCK
    // =========================
    let decisionBlock = "";

    if (decision.decision || decision.action || decision.reason) {
      decisionBlock = `
----------------------------

🧠 Final Decision:

👉 ${decision.decision || ""}

📌 Kya karein:
👉 ${decision.action || ""}

💡 Kyun:
${decision.reason || ""}
      `;
    }

    // =========================
    // ⚠️ SIGNALS BLOCK
    // =========================
    let signalsBlock = "";

    if (data.signals && data.signals.length > 0) {
      signalsBlock = `
----------------------------

⚠️ Risk Signals:
- ${data.signals.join("\n- ")}
      `;
    }

    // =========================
    // 👉 ADVICE BLOCK
    // =========================

let domainBlock = "";

if (
  data.domainInfo &&
  data.domainInfo.success
) {

  domainBlock = `
----------------------------

🌍 Domain Information

🔹 Domain:
${data.domainInfo.domain}

📅 Domain Age:
${data.domainInfo.age}

🏢 Registrar:
${data.domainInfo.registrar}

⚠️ Domain Risk:
${data.domainInfo.risk}

📝 Status:
${data.domainInfo.message}
`;

}
    let adviceBlock = "";

    if (data.advice && data.advice.length > 0) {
      adviceBlock = `
----------------------------

👉 Aap kya karein:
- ${data.advice.join("\n- ")}
      `;
    }

    // =========================
    // 🎯 FINAL OUTPUT
    // =========================
    resultBox.innerText = `
${data.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

${riskBlock}

${confidenceBlock}

${categoryBlock}

🧠 Analysis

${explanation}

${decisionBlock}

${evidenceBlock}

${signalsBlock}

${domainBlock}

${adviceBlock}
`.trim();

    // ✅ SHOW FEEDBACK UI
    feedbackBox.style.display = "block";

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}


// =========================
// 👍 FEEDBACK SYSTEM
// =========================
async function sendFeedback(type) {

  const message = document.getElementById("input").value;

  try {

    await fetch(
      "https://script.google.com/macros/s/AKfycby5KiRfYhhHGa4jAS1QDy64eI1EzYmgkB_Bd3zo_fvAMX99pzysGi4J03viLijZgvOw1A/exec",
      {
        method: "POST",
        body: JSON.stringify({
          message: message,
          feedback: type,
          report: ""
        })
      }
    );

    alert("❤️ Feedback saved successfully");

  } catch (err) {

    console.error(err);

    alert("❌ Feedback failed");
  }
}


// =========================
// 🚨 OPEN REPORT MODAL
// =========================
async function reportIssue() {

  document.getElementById(
    "reportModal"
  ).style.display = "flex";
}


// =========================
// ❌ CLOSE REPORT MODAL
// =========================
function closeReportModal() {

  document.getElementById(
    "reportModal"
  ).style.display = "none";
}


// =========================
// 📤 SUBMIT REPORT
// =========================
async function submitReport() {

  const message =
    document.getElementById("input").value;

  const selected =
    document.querySelector(
      'input[name="reportReason"]:checked'
    );

  const customReason =
    document.getElementById(
      "customReport"
    ).value;

  const reason =
    selected
      ? selected.value
      : "No option selected";

  try {

    await fetch(
      "https://script.google.com/macros/s/AKfycby5KiRfYhhHGa4jAS1QDy64eI1EzYmgkB_Bd3zo_fvAMX99pzysGi4J03viLijZgvOw1A/exec",
      {
        method: "POST",

        body: JSON.stringify({

          message: message,

          feedback: "",

          report: reason,

          customReason: customReason
        })
      }
    );

    alert("✅ Report submitted successfully");

    closeReportModal();

  } catch (err) {

    console.error(err);

    alert("❌ Report failed");
  }
}
