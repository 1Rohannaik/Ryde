const User = require("../src/model/userModel");

const createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await User.create({
    firstName: firstname,
    lastName: lastname,
    email,
    password,
  });

  return user;
};

module.exports = { createUser };
