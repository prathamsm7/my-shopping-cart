require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dqm9cemhk",
  api_key: "273768889229629",
  api_secret: "WeS5btOPHc-R3rapzpXJzA4aLlE",
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
