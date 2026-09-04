const axios = require("axios");
const { getZohoAccessToken } = require("../services/zohoAuthService");

const zohoRequest = async (url, res, service) => {
  try {
    const token = await getZohoAccessToken();

    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    // Zoho can return HTTP 200 while reporting an API-level error
    if (
      response.data?.response?.status === 1 ||
      response.data?.response?.errors
    ) {
      return res.status(502).json({
        message: `Failed to connect to ${service}`,
        service,
        data: response.data,
      });
    }

    res.json({
      service,
      data: response.data,
    });
  } catch (error) {
    console.error(
      `${service} error:`,
      error.response?.data || error.message
    );

    res.status(502).json({
      message: `Failed to connect to ${service}`,
      error: error.response?.data || error.message,
    });
  }
};

const getPeople = (req, res) =>
  zohoRequest(
    "https://people.zoho.in/people/api/forms",
    res,
    "Zoho People"
  );

const getCRM = (req, res) =>
  zohoRequest(
    "https://www.zohoapis.in/crm/v8/settings/modules",
    res,
    "Zoho CRM"
  );

const getDesk = (req, res) =>
  zohoRequest(
    "https://desk.zoho.in/api/v1/tickets",
    res,
    "Zoho Desk"
  );

const getBooks = (req, res) =>
  zohoRequest(
    "https://www.zohoapis.in/books/v3/organizations",
    res,
    "Zoho Books"
  );

module.exports = {
  getPeople,
  getCRM,
  getDesk,
  getBooks,
};