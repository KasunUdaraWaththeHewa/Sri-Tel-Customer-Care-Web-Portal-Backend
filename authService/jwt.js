const jwt = require("jsonwebtoken");


const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, "M5vH+hjjkkPdcuB4EI7EuVgQrq9hSOZ6w3/rYFtE0tUaSGh6A+aWV/qc0i9mebYr0bnatT6Bvllwx/HizXvj6Q==", { expiresIn: "3d",algorithm: 'HS256' });
};


var token = createToken("60f7a7e1b4e4a7f2d8c8c4b4", "admin");
console.log(token);

