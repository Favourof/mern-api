require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Mongoose model
const Item = mongoose.model("Item", new mongoose.Schema({ name: String }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express in WSL, Ezekiel!" });
});
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
app.post("/items", async (req, res) => {
  try {
    const item = new Item({ name: req.body.name || "Test Item" });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: "Failed to create item" });
  }
});

// Only connect and listen if not in test mode
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, { ssl: true })
    .then(() => {
      app.listen(process.env.PORT || 3001, () =>
        console.log(`Server running on port ${process.env.PORT || 3001}`)
      );
      console.log("MongoDB connected");
    })
    .catch((err) => console.error("MongoDB error:", err));
}

module.exports = app;
