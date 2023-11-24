const Comment = require("../model/comment");
const router = require("express").Router();

//get comments to product
router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const comments = await Comment.find({ productId });
        res.json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

router.post("/add", async (req, res) => {
    const newComment = new Comment(req.body);
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});


// PUT update comment by ID
router.put('/update/:id', async (req, res) => {
    try {
      const commentId = req.params.id;
      const updatedComment = req.body;
      await Comment.findByIdAndUpdate(commentId, updatedComment);
  
      // Make the necessary update to the comment in the API or database
      // For example, you can use Comment.findByIdAndUpdate() for MongoDB
  
      res.json(updatedComment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update comment' });
    }
  });


  // DELETE comment by _id
router.delete('/delete/:id', async (req, res) => {
    try {
      const commentId = req.params.id;
      await Comment.findByIdAndDelete(commentId);
  
        res.json({ message: 'Comment deleted successfully' });
    
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete the comment' });
    }
  });



module.exports = router;