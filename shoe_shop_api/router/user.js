
const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");

//ADD A USER
router.post("/add", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: hashed
      });
      const user = await User.create(newUser);
      res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
      // if (err) return console.error(err);
      // res.send(user);
    }});

//GET ALL USERS
 router.get("/", async (req, res) => {
    try {
      const allUsers = await User.find({});
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

// //GET A USER
 router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

// //UPDATE A USER
 router.put("/:id", async (req, res) => {
    try {
      // const user = await user.findById(req.params.id);
      // await user.updateOne({ $set: req.body });
      const {id} = req.params;
      const user = await User.findByIdAndUpdate(id, req.body);
      // we cannot find any user in database
      if(!user){
          return res.status(404).json({message: `cannot find any user with ID ${id}`})
      }
      const updatedUser = await User.findById(id);
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  }
 )
// //DELETE A USER
router.delete("/:id",async (req, res) => {
  try {
  const user = await User.findByIdAndDelete(req.params.id);
  if(!user){
    return res.status(404).json({message: `cannot find any user with ID ${id}`})
};
  res.status(200).json('Deleted successfully');
} catch (error) {
  res.status(500).json({message: error.message})
}

  //   if (err) return console.error(err);
  // res.send(user + ' was deleted');

})

module.exports = router;