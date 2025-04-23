const https = require("https");

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1364736685690064966/CMsYAZc2EX1PNMaFs8FnIlGb2tGrIQ4GXtsoKcYc2i94XZS-4raVPmc35zkiVU9dhy_r";

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Send entire payload to Discord for inspection
    const payload = JSON.stringify({
      content: `📥 Vulcan Webhook Received:\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\``
    });

    const url = new URL(DISCORD_WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, res => {
      res.on('data', d => process.stdout.write(d));
    });

    req.on('error', error => {
      console.error("Failed to ping Discord:", error);
    });

    req.write(payload);
    req.end();

    // Proceed with role decision logic (just block the test wallet for now)
    const wallet = body.wallet?.toLowerCase();
    const bannedWallets = ["0x229bc9afe9d1743ba0a2f929ff2e4e0184866f11"];

    const isBlocked = wallet && bannedWallets.includes(wallet);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: !isBlocked })
    };

  } catch (error) {
    console.error("Webhook failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" })
    };
  }
};
