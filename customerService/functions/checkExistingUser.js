const axios = require("axios");

const checkExistingUser = async (email, token) => {
  try {
    //hari token eka capture krgnn one. eka hari giyoth wade hari yawi
    const authServiceUrl = `http://bff:4901/api/proxy/forward/user/getProfileDetails/${email}`;
    console.log("token at check existing user: ", token);

    const authResponse = await axios.post(
      authServiceUrl,
      { email },
      {
        headers: {
          Authorization: token,
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
