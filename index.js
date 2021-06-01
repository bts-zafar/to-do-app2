
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 3000;
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
dotenv.config();

app.use(express.urlencoded({ extended: true }));
//public folder
app.use("/static", express.static("public"));
//view engine
app.set("view engine", "ejs");

// GET the APP 
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("index.ejs", { todoTasks: tasks });
  });
});

// post to server
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

//connection to db
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running on ${port}"));
});