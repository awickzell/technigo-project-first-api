import express from "express";
import { Song } from "../models/Songs.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { page, limit } = req.query;
    let query = Song.find();

    if (limit) {
    const skip = (page - 1) * limit || 0;
    query = query.skip(skip).limit(Number(limit));
    }

    const songs = await query;
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findOne({ id: req.params.id });
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/genre/:genre", async (req, res) => {
  try {
    const songs = await Song.find({ genre: req.params.genre });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/popular", async (req, res) => {
  try {
    const songs = await Song.find().sort({ popularity: -1 }).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
