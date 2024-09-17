const axios = require("axios");

const checkExistingUser = async (email) => {
  try {
    const authServiceUrl = `http://localhost:4901/api/proxy/forward/user/isInActiveUser`;

    const authResponse = await axios.post(
      authServiceUrl,
      { email },
      {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YTdlMWI0ZTRhN2YyZDhjOGM0YjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjY1ODA5MzcsImV4cCI6MjY3MzMwODkzN30.ivHjIGs__XGAv62dD6ZXnLO7uyZobC1ItQWGDkl-Gs8`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response as is from the BFF
    return authResponse.data;
  } catch (error) {
    // If there's an error, capture it and throw it back to the calling function
    if (error.response) {
      // Return the status and error message from the user service
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data.message,
        data: null,
      };
    } else {
      return {
        success: false,
        statusCode: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
};

module.exports = { checkExistingUser };
