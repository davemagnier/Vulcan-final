const https = require("https");

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1364736685690064966/CMsYAZc2EX1PNMaFs8FnIlGb2tGrIQ4GXtsoKcYc2i94XZS-4raVPmc35zkiVU9dhy_r";

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const wallet = body.wallet?.toLowerCase();

    const bannedWallets = [
      "0x229bc9afe9d1743ba0a2f929ff2e4e0184866f11"
    ];

    if (!wallet) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing wallet" })
      };
    }

    if (bannedWallets.includes(wallet)) {
      const payload = JSON.stringify({
        content: `🔒 Blocked wallet tried to verify: \`${wallet}\``
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

      return {
        statusCode: 200,
        body: JSON.stringify({ success: false })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("Webhook failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" })
    };
  }
};
