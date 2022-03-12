const { connect } = require("getstream");
const bcrypt = require("bcrypt");
const StreamChat = require("stream-chat").StreamChat;
const crypto = require("crypto");
require("dotenv").config();
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;
const signUp = async (req, res) => {
  try {
    const { email, username, password, dateOfBirth } = req.body;
    const userId = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(api_key, api_secret, app_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);
    res
      .status(200)
      .send({ userId, token, email, username, hashedPassword, dateOfBirth });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);
    const { users } = await client.queryUsers({ email });
    if (!users.length)
      return res.status(400).send({ message: "User not found!" });
    const success = await bcrypt.compare(password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);
    if (success) {
      res.status(200).send({
        token,
        username: users[0].username,
        email,
        userId: users[0].id,
      });
    } else {
      res.status(500).send({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
module.exports = { logIn, signUp };
