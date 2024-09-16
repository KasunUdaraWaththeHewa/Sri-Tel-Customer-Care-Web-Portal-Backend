const axios = require("axios");

const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Call Auth Service to validate the token
        const authServiceUrl = process.env.CORE_AUTH_SERVICE_URL || 'http://localhost:4907/api/auth/validate-jwt';
        const response = await axios.post(authServiceUrl, { token });

        if (response.data && response.data.success) {
            req.user = response.data.user; // Attach user details to the request
            next(); // Proceed if the token is valid
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Authentication service error" });
    }
};

module.exports = requireAuth;
