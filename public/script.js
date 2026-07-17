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
 resultBox.className = "card result-card";
resultBox.innerText = "";

riskFill.style.width = "5%";
riskFill.style.background = "#22c55e";
riskText.innerText = "Safe";

confidenceFill.style.width = "100%";
confidenceText.innerText = "100%";

feedbackBox.style.display = "none";

loadingBox.style.display = "block";

riskMeter.style.display = "none";

confidenceCard.style.display = "none";

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
    const hasURL =
data.urlAnalysis &&
data.urlAnalysis.found;

   loadingBox.style.display = "none";

riskMeter.style.display = "block";

confidenceCard.style.display = "block";
 riskFill.style.width =
data.riskScore + "%";

if (data.riskScore <= 10) {

  riskFill.style.background = "#22c55e";
  riskText.innerText = "Very Safe";

}
else if (data.riskScore <= 30) {

  riskFill.style.background = "#84cc16";
  riskText.innerText = "Low Risk";

}
else if (data.riskScore <= 60) {

  riskFill.style.background = "#f59e0b";
  riskText.innerText = "Suspicious";

}
else if (data.riskScore <= 85) {

  riskFill.style.background = "#f97316";
  riskText.innerText = "High Risk";

}
else {

  riskFill.style.background = "#ef4444";
  riskText.innerText = "Dangerous";

}
confidenceFill.style.width =
data.confidence + "%";

confidenceText.innerText =
data.confidence + "%";

    const lang =
data.language || "hi";

    const type = data.type;
    const decision = data.decision || {};

    // =========================
    // 🟢 SAFE MODE
    // =========================
   if (type === "SAFE") {

  resultBox.className = "card result-card safe";

  resultBox.innerHTML = `
<div>${data.explanation}</div>

${hasURL ? `

<hr>

<div class="detail-links">

<button class="details-btn" onclick="toggleDetail('safeBrowsingDetail')">
▶🛡️View Google Safe Browsing Details
</button>

<div
id="safeBrowsingDetail"
class="detail-box"
style="display:none;">
${data.safeBrowsingExplanation || ""}
</div>

<button class="details-btn" onclick="toggleDetail('virusTotalDetail')">
▶🦠View VirusTotal Scan Details
</button>

<div
id="virusTotalDetail"
class="detail-box"
style="display:none;">
${data.virusTotalExplanation || ""}
</div>

<button class="details-btn" onclick="toggleDetail('domainDetail')">
▶🌍view Domain Information
</button>

<div
id="domainDetail"
class="detail-box"
style="display:none;">
${data.domainExplanation || ""}
</div>

<button class="details-btn" onclick="toggleDetail('sslDetail')">
▶🔒View SSL Certificate Details
</button>

<div
id="sslDetail"
class="detail-box"
style="display:none;">
${data.sslExplanation || ""}
</div>

<button class="details-btn" onclick="toggleDetail('dnsDetail')">
▶🌐View DNS Security Details
</button>

<div
id="dnsDetail"
class="detail-box"
style="display:none;">
${data.dnsExplanation || ""}
</div>

` : ""}

`;

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
  hasURL &&
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
    resultBox.innerHTML = data.explanation;

    // ✅ SHOW FEEDBACK UI
    feedbackBox.style.display = "block";

  } catch (error) {  
    console.error("Fetch Error:", error);
  
 loadingBox.style.display = "none";  
  
riskMeter.style.display = "none";  
  
confidenceCard.style.display = "none";  
  
    resultBox.className = "result-box danger";  
    resultBox.innerText =  
      "❌ Server error. Please refresh and try again.";  
  }  
}  

function toggleDetail(id){

const box=document.getElementById(id);

if(box.style.display==="none"){

box.style.display="block";

}

else{

box.style.display="none";

}

}
function getSeverityBadge(severity) {

  switch ((severity || "").toLowerCase()) {

    case "critical":
      return "🔴 Critical";

    case "high":
      return "🟠 High";

    case "medium":
      return "🟡 Medium";

    case "low":
      return "🟢 Low";

    case "info":
    default:
      return "🔵 Info";
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
