const bcrypt = require("bcryptjs");

async function generateHashedPassword() {
  const password = "123456"; // Change this to any password you want
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);
}

generateHashedPassword();
$2b$10$NljX5tQi8sjqb9RGJO5ghup9dZh4GSg4VHhPlT9bEMuFAK4zntDPi;
