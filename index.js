import express from "express";

// create app instance and set port
const app = express();
const port = 3000;

// counter to keep track of each post
let idCounter = 1;

// open app using express
app.use(express.static("public"));

// create posts array, and 
const posts = [];
app.use(express.urlencoded({ extended: true }));

// render the index.ejs file
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// render the about file
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// render the post file
app.get("/post", (req, res) => {
  res.render("post.ejs");
});


// EDITING START
// handles editing
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.render("edit.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// handles updating the edited post
app.post("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (post) {
    const { name, email, text } = req.body;
    post.name = name;
    post.email = email;
    post.text = text;
    post.timestamp = new Date().toLocaleString(); // update time
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});
// EDITING END


// DELETING START
app.post("/delete/:id", (req, res) => {
  const postIndex = posts.findIndex(p => p.id == req.params.id);
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});
// DELETING END


// handle post requests, aka adding posts to the system
app.post("/post", (req, res) => {

  const { name, email, text } = req.body;

  const maxNameLength = 50;
  const maxEmailLength = 100;

  if (name.length > maxNameLength || email.length > maxEmailLength) {
    return res.status(400).send("Name or email too long.");
  }

  const timestamp = new Date().toLocaleString();
  posts.push({ id: idCounter++, name, email, text, timestamp });
  res.redirect("/");
})

// listen for the port and serve the information and stuff
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 