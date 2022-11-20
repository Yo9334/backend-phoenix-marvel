const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

// endpoint signup
router.post("/user/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    let user = await User.findOne({ email: email });
    if (user !== null) {
      return res.status(409).json({ message: "This email is already exist." });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Some parameters are missing." });
    }

    const salt = uid2(16);
    const token = uid2(64);
    const hash = SHA256(salt + password).toString(encBase64);

    user = {
      username: username,
      email: email,
      token: token,
      hash: hash,
      salt: salt,
    };

    const newUser = new User(user);
    await newUser.save();

    res.json({
      _id: newUser._id,
      token: newUser.token,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// endpoint login
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!email || !password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newHash = SHA256(user.salt + password).toString(encBase64);
    if (newHash === user.hash) {
      res.json({
        _id: user._id,
        token: user.token,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/favCharacters", async (req, res) => {
  const { idUser, idCharacter, active } = req.body;
  console.log(req.body); //

  try {
    let update = {};
    if (active === true) {
      update = { $push: { characters: idCharacter } };
    } else if (active === false) {
      update = { $pull: { characters: idCharacter } };
    }

    const user = await User.findByIdAndUpdate(idUser, update);
    res.json("succeeded");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/favComics", async (req, res) => {
  const { idUser, idComic, active } = req.body;
  console.log(req.body); //

  try {
    let update = {};
    if (active === true) {
      update = { $push: { comics: idComic } };
    } else if (active === false) {
      update = { $pull: { comics: idComic } };
    }

    const user = await User.findByIdAndUpdate(idUser, update);
    res.json("succeeded");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/favorite", async (req, res) => {
  const { id } = req.query;
  console.log(req.query); //

  try {
    const user = await User.findById(id);

    if (user !== null) {
      res.json({
        id: user._id,
        comics: user.comics || [],
        characters: user.characters || [],
      });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
