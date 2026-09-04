const axios = require("axios");

const getZohoAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Zoho OAuth error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to obtain Zoho access token");
  }
};

module.exports = {
  getZohoAccessToken,
};