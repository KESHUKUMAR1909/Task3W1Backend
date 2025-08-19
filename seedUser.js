const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb+srv://keshukumar1909:8810630470@cluster0.r4h3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    const users = ["Rahul", "Kamal", "Sanak", "Ravi", "Sita", "Anita", "Karan", "Neha", "Amit", "Priya"];
    for (let name of users) {
      await User.updateOne({ name }, { name }, { upsert: true });
    }
    console.log("Users seeded");
    mongoose.connection.close();
  });
