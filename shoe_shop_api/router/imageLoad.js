const express = require('express').Router;
const cors = require("cors");
const router = express();
const uploadImage = require('../router/image');
router.use(cors());


router.post('/uploadImage',(req,res)=>{
    uploadImage(req.body.image)
    .then((url)=>res.send(url))
    .catch((err)=>res.status(500).send(err))
})


router.post("/uploadMultipleImages", (req, res) => {
    uploadImage.uploadMultipleImages(req.body.images)
      .then((urls) => res.send(urls))
      .catch((err) => res.status(500).send(err));
  });
  
// Xóa một hình ảnh với public_id được truyền qua tham số URL
router.delete("/:public_id", (req, res) => {

  const public_id = req.params.public_id;
  console.log(public_id);
  uploadImage.deleteImage(public_id)
    .then((result) => res.send("deleted successfully " + public_id))
    .catch((error) => res.status(500).send(error));
  });
  

  module.exports = router;