const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const User = require("./models/User.js");
const History = require("./models/History.js");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Get all users and rankings
app.get("/users", async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  const rankedUsers = users.map((user, index) => ({
    rank: index + 1,
    ...user._doc
  }));
  res.json(rankedUsers);
});

app.post("/claim", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    console.log("Claiming points for userId:", userId);

    const points = Math.floor(Math.random() * 10) + 1;

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: points } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await History.create({ userId, points });

    res.json({ user, points });
  } catch (err) {
    console.error("Error in /claim:", err);
    res.status(500).json({ message: err.message });
  }
});


// Add new user
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = await User.create({ name });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get claim history
app.get("/history", async (req, res) => {
  const history = await History.find().populate("userId");
  res.json(history);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
