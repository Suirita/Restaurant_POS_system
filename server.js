const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/api/save-image", (req, res) => {
  const { path: imagePath, content } = req.body;
  const buffer = Buffer.from(content, "base64");
  fs.writeFile(path.join(__dirname, imagePath), buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving image");
    }
    res.status(200).json({ message: "Image saved successfully" });
  });
});

app.post("/api/update-json", (req, res) => {
  const { path: jsonPath, content } = req.body;
  fs.writeFile(
    path.join(__dirname, jsonPath),
    JSON.stringify(content, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating JSON file");
      }
      res.status(200).json({ message: "JSON file updated successfully" });
    }
  );
});

app.post("/api/delete-image", (req, res) => {
  const { path: imagePath } = req.body;
  fs.unlink(path.join(__dirname, imagePath), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting image");
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
