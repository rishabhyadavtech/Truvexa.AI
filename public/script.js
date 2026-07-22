const SUPABASE_URL = "https://okuufwhspjocsnnmdpkd.supabase.co";
const SUPABASE_KEY = "sb_publishable_9b6klFx52hR46xKzOWxDfQ_S0GcwSD6";
   const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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

resultBox.innerHTML = `

<div class="summary-block">

${data.explanation}

</div>

${hasURL ? `

<hr>

<div class="security-summary">

<div class="summary-title">
🛡 Google Safe Browsing
</div>

<div class="summary-text">
${data.safeBrowsingSummary || ""}
</div>

<button class="details-btn"
onclick="toggleDetail('safeBrowsingDetail')">

▶ View Details

</button>

<div id="safeBrowsingDetail"
class="detail-box"
style="display:none;">

${data.safeBrowsingExplanation || ""}

</div>

</div>

<div class="security-summary">

<div class="summary-title">
🦠 VirusTotal
</div>

<div class="summary-text">
${data.virusTotalSummary || ""}
</div>

<button class="details-btn"
onclick="toggleDetail('virusTotalDetail')">

▶ View Details

</button>

<div id="virusTotalDetail"
class="detail-box"
style="display:none;">

${data.virusTotalExplanation || ""}

</div>

</div>

<div class="security-summary">

<div class="summary-title">
🌍 Domain Information
</div>

<div class="summary-text">
${data.domainSummary || ""}
</div>

<button class="details-btn"
onclick="toggleDetail('domainDetail')">

▶ View Details

</button>

<div id="domainDetail"
class="detail-box"
style="display:none;">

${data.domainExplanation || ""}

</div>

</div>

<div class="security-summary">

<div class="summary-title">
🔒 SSL Certificate
</div>

<div class="summary-text">
${data.sslSummary || ""}
</div>

<button class="details-btn"
onclick="toggleDetail('sslDetail')">

▶ View Details

</button>

<div id="sslDetail"
class="detail-box"
style="display:none;">

${data.sslExplanation || ""}

</div>

</div>

<div class="security-summary">

<div class="summary-title">
🌐 DNS Security
</div>

<div class="summary-text">
${data.dnsSummary || ""}
</div>

<button class="details-btn"
onclick="toggleDetail('dnsDetail')">

▶ View Details

</button>

<div id="dnsDetail"
class="detail-box"
style="display:none;">

${data.dnsExplanation || ""}

</div>

</div>

` : ""}

`;

}

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
     const { error } = await supabase
.from("Feedback")
.insert([
{
message: message,
feedback: type
}
]);

if (error) {
  console.log(error);
  alert(JSON.stringify(error));
  throw error;
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

    document.querySelector(".feedback-actions").innerHTML = `

<div class="feedback-error">

❌ Unable to save feedback.

Please try again later.

</div>

`;
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
    const { error } = await supabase
.from("Feedback")
.insert([
{
message: message,
report: reason,
customreason: customReason
}
]);

if (error) throw error;

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
