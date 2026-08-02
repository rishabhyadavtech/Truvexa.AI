async function checkScam() {

 const message = document.getElementById("input").value.trim();
const textarea = document.getElementById("input");
textarea.style.height = "90px";

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
document.getElementById("result").style.display = "none";
document.getElementById("trustBox").style.display = "none";
document.getElementById("featureBox").style.display = "none";

document.querySelector(".feedback-actions").innerHTML = `

<button
class="btn-success"
onclick="sendFeedback('yes')">

👍 Yes, Helpful

</button>

<button
class="btn-danger"
onclick="reportIssue()">

👎 Needs Improvement

</button>

`;
document.querySelector(".feedback-note").style.display = "block";

loadingBox.style.display = "block";
document.getElementById("result").style.display = "block";

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
 
  renderResult(resultBox,data, hasURL);

  feedbackBox.style.display = "block";
document.getElementById("trustBox").style.display = "block";
document.getElementById("featureBox").style.display = "block";

  return;
}

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

function renderResult(resultBox,data, hasURL) {

resultBox.innerHTML = "";

const risk = data.riskScore || 0;

if (risk <= 20) {

resultBox.innerHTML = `

<div class="decision-card safe">

<div class="decision-icon">🟢</div>

<h2 class="decision-title">
Safe
</h2>

<p class="decision-subtitle">

This message appears safe.

</p>

<div class="confidence-row">

<span>AI Confidence</span>

<strong>${data.confidence}%</strong>

</div>

<div class="next-action safe-action">

✅ You can continue normally.

<br><br>

Still avoid sharing OTPs, passwords or banking details.

</div>

</div>

`;

return;

}
// ===============================
// 🟡 Suspicious / 🔴 Dangerous
// ===============================

const isDanger = risk >= 60;

resultBox.innerHTML = `

<div class="decision-card ${isDanger ? "danger" : "warning"}">

<div class="decision-icon">
${isDanger ? "🔴" : "🟡"}
</div>

<h2 class="decision-title">
${isDanger ? "Scam Detected" : "Suspicious"}
</h2>

<p class="decision-subtitle">
${isDanger
? "Do NOT trust this message until you verify it."
: "Be careful before trusting this message."}
</p>

<div class="confidence-row">

<span>AI Confidence</span>

<strong>${data.confidence}%</strong>

</div>

<div class="why-box">

<h3>Why did Truvexa flag this?</h3>

<p>

${data.explanation || "Multiple suspicious patterns were detected."}

</p>

</div>

<div class="action-box">

<h3>What should I do?</h3>

<p>

${isDanger
? "❌ Don't click links, don't share OTP, password or banking details."
: "⚠️ Verify the sender before taking any action."}

</p>

</div>

<button
class="details-btn"
onclick="toggleDetail('technicalDetails')">

▼ View Technical Details

</button>

<div
id="technicalDetails"
class="detail-box"
style="display:none;">

<b>🛡 Google Safe Browsing</b><br>
${data.safeBrowsingExplanation || "No data"}<br><br>

<b>🦠 VirusTotal</b><br>
${data.virusTotalExplanation || "No data"}<br><br>

<b>🌍 Domain Information</b><br>
${data.domainExplanation || "No data"}<br><br>

<b>🔒 SSL Certificate</b><br>
${data.sslExplanation || "No data"}<br><br>

<b>🌐 DNS Security</b><br>
${data.dnsExplanation || "No data"}

</div>

</div>

`;
}
// Auto Expand Textarea
const textarea = document.getElementById("input");

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 320) + "px";
});

function toggleDetail(id){

const box=document.getElementById(id);

if(
box.style.display==="none" ||
box.style.display===""){

box.style.display="block";

}else{

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
   const res = await fetch("/feedback", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: message,
    feedback: type
  })
});

const data = await res.json();

if (!data.success) {
  throw new Error(data.error);
}
 document.querySelector(".feedback-actions").innerHTML = `

<div class="feedback-success">

✅ Thank you ☺️!

<br><br>

Your feedback has been securely received.

It will help improve future scam detection accuracy.

</div>

`;

  } catch (err) {

  console.error(err);

  alert("ERROR:\n" + JSON.stringify(err, null, 2));

}

}
// =========================
// 🚨 OPEN REPORT MODAL
// =========================
  function reportIssue(){

const modal =
document.getElementById("reportModal");

modal.style.display="flex";

}
// ==========================
// 📌 CLOSE REPORT MODAL
// ==========================
function closeReportModal(){

document.getElementById(
"reportModal"
).style.display="none";

document.getElementById(
"customReport"
).value="";

document
.querySelectorAll(
'input[name="reportReason"]'
)
.forEach(x=>x.checked=false);

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
   const res = await fetch("/feedback", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: message,
    report: reason,
    custom_reason: customReason
  })
});

const data = await res.json();

if (!data.success) {
  throw new Error(data.error);
}

document.querySelector(".feedback-actions").innerHTML = `

<div class="feedback-success">

✅ Report submitted successfully.

<br><br>

Your report has been securely received.

It will help improve future scam detection and security analysis.

Thank you for helping improve Truvexa AI🚀.

</div>

`;

document.querySelector(".feedback-note").style.display = "none";
closeReportModal();

  } catch (err) {

  console.error(err);

  alert("❌ Unable to submit report. Please try again.");

  document.querySelector(".feedback-actions").innerHTML = `

<div class="feedback-error">

❌ Unable to submit report.

Please try again later.

</div>

`;

}
}
