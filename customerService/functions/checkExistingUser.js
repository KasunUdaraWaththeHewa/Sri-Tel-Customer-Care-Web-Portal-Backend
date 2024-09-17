const axios = require("axios");

const checkExistingUser = async (email, token) => {
  try {
    console.log(token);
    //hari token eka capture krgnn one. eka hari giyoth wade hari yawi
    const authServiceUrl = `http://localhost:4901/api/proxy/forward/user/getProfileDetails/${email}`;

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
    console.log("Auth Response");
    console.log(authResponse);
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
