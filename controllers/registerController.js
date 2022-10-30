const User = require("../model/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "user and password are required" });

  //check for duplicate user names

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res.status(409).json({ message: "user already exists" });
  try {
    //encrypt the password

    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the user

    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    // console.log(result);

    res.status(201).json({ success: `New User ${user} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
