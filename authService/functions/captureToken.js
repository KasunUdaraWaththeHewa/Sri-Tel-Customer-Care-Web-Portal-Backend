const captureToken = (req) => {
  //   const rawHeaders = req.rawHeaders;
  //   console.log(req);
  //   let token = null;
  //   const authIndex = rawHeaders.indexOf("Authorization");

  //   if (authIndex !== -1) {
  //     token = rawHeaders[authIndex + 1];
  //   }
  const token = req.headers.authorization;

  return token;
};

module.exports = { captureToken };
