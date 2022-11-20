const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const url = process.env.MARVEL_URL;
const key = process.env.MARVEL_API_KEY;

router.get("/comics", async (req, res) => {
  try {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 100;
    const title = req.query.title || "";

    const response = await axios.get(
      `${url}comics?apiKey=${key}&skip=${skip}&limit=${limit}&title=${title}`
    );
    res.json(response.data);
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    const id = req.params.characterId || "";

    if (id !== "") {
      const response = await axios.get(`${url}comics/${id}?apiKey=${key}`);
      res.json(response.data);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/comic/:characterId", async (req, res) => {
  try {
    const id = req.params.characterId || "";

    if (id !== "") {
      const response = await axios.get(`${url}comic/${id}?apiKey=${key}`);
      res.json(response.data);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/characters", async (req, res) => {
  try {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 100;
    const name = req.query.name || "";

    const response = await axios.get(
      `${url}characters?apiKey=${key}&skip=${skip}&limit=${limit}&name=${name}`
    );
    res.json(response.data);
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
});

router.get("/character/:characterId", async (req, res) => {
  try {
    const id = req.params.characterId || "";

    if (id !== "") {
      const response = await axios.get(`${url}character/${id}?apiKey=${key}`);
      res.json(response.data);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
