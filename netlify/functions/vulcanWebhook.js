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
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" })
    };
  }
};
