const axios = require("axios");

const checkExistingUser = async (email, token) => {
  try {
    //hari token eka capture krgnn one. eka hari giyoth wade hari yawi
    const authServiceUrl = `http://bff:4901/api/proxy/forward/user/getProfileDetails/${email}`;

    const authResponse = await axios.post(
      authServiceUrl,
      { email },
      {
        headers: {
          // Authorization: token,
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmU5YjRlYzM1ZDYwNDA2NDFkMzk0YWIiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MjY1OTIyODYsImV4cCI6MTcyNjg1MTQ4Nn0.AhxyuIlIRyx_Tx3UP1nr1M9od3i-B3BSjAMhKGbQqXs`,
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
