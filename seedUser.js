const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("")
  .then(async () => {
    const users = ["Rahul", "Kamal", "Sanak", "Ravi", "Sita", "Anita", "Karan", "Neha", "Amit", "Priya"];
    for (let name of users) {
      await User.updateOne({ name }, { name }, { upsert: true });
    }
    console.log("Users seeded");
    mongoose.connection.close();
  });
