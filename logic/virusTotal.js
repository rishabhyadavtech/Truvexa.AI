const fetch = global.fetch;

const VIRUSTOTAL_API =
  "https://www.virustotal.com/api/v3/urls";

async function checkVirusTotal(url) {

  if (!url) {
    return {
      success: false,
      safe: true,
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      message: "No URL detected."
    };
  }

  if (!process.env.VIRUSTOTAL_API_KEY) {
    return {
      success: false,
      safe: true,
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      message: "VirusTotal API key not configured."
    };
  }

  try {

    // STEP 1 - Submit URL
    const submit = await fetch(VIRUSTOTAL_API, {
      method: "POST",
      headers: {
        "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `url=${encodeURIComponent(url)}`
    });

    const submitData = await submit.json();

    if (!submit.ok) {
      throw new Error(submitData.error?.message || "Submit failed");
    }

    const analysisId = submitData.data.id;

    // STEP 2 - Wait
    await new Promise(resolve => setTimeout(resolve, 5000));

    // STEP 3 - Get Report
    const report = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          "x-apikey": process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const reportData = await report.json();

    if (!report.ok) {
      throw new Error(reportData.error?.message || "Report failed");
    }

    const stats = reportData.data.attributes.stats;
   
   return {

      success: true,

      safe: stats.malicious === 0,

      malicious: stats.malicious,

      suspicious: stats.suspicious,

      harmless: stats.harmless,

      undetected: stats.undetected,

      message: "VirusTotal analysis completed."

    };

  } catch (err) {

    return {

      success: false,

      safe: true,

      malicious: 0,

      suspicious: 0,

      harmless: 0,

      undetected: 0,

      message: err.message

    };

  }

}

module.exports = {
  checkVirusTotal
};