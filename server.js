import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import songsRouter from "./routes/songs.js";
import { Song } from "./models/Songs.js";
import fs from "fs";
import path from "path";

const topMusicData = JSON.parse(fs.readFileSync(path.resolve("data/top-music.json"), "utf-8"));

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
mongoose.connection.once("open", () => console.log("Connected to MongoDB!"));


if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany({});
    await Song.insertMany(topMusicData);
    console.log("Database seeded!");
  };
  seedDatabase();
}


app.use("/songs", songsRouter);


app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});