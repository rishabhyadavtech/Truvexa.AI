const fetch = global.fetch;

const URLSCAN_API = "https://urlscan.io/api/v1";

async function checkURLScan(url) {

  if (!url) {
    return {
      success: false,
      safe: true,
      malicious: false,
      score: 0,
      screenshot: null,
      report: null,
      message: "No URL detected."
    };
  }

  if (!process.env.URLSCAN_API_KEY) {
    return {
      success: false,
      safe: true,
      malicious: false,
      score: 0,
      screenshot: null,
      report: null,
      message: "URLScan API key not configured."
    };
  }

  try {

    // STEP 1 - Submit URL
    const submit = await fetch(
      `${URLSCAN_API}/scan/`,
      {
        method: "POST",
        headers: {
          "API-Key": process.env.URLSCAN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          visibility: "public"
        })
      }
    );

    const submitData = await submit.json();

    if (!submit.ok) {
      throw new Error(submitData.message || "Scan submit failed");
    }

    // STEP 2 - Wait
    await new Promise(resolve => setTimeout(resolve, 8000));

    // STEP 3 - Get Result
    const result = await fetch(
      `${URLSCAN_API}/result/${submitData.uuid}/`
    );

    const data = await result.json();

    if (!result.ok) {
      throw new Error("Result fetch failed");
    }

    const verdict =
      data.verdicts?.overall || {};

    return {

      success: true,

      safe: verdict.malicious !== true,

      malicious: verdict.malicious || false,

      score: verdict.score || 0,

      screenshot:
        data.task?.screenshotURL || null,

      report:
        data.task?.reportURL || null,

      uuid:
        submitData.uuid,

      message:
        "URLScan analysis completed."

    };

  } catch (err) {

    return {

      success: false,

      safe: true,

      malicious: false,

      score: 0,

      screenshot: null,

      report: null,

      message: err.message

    };

  }

}

module.exports = {
  checkURLScan
};