const router = require("express").Router();
const Product = require("../model/product");

router.get('/:search', async (req, res) => {
  const query = req.params.search; // Từ khóa tìm kiếm

  try {
    let products;

    if (query) {
      products = await Product.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa/chữ thường)
          { brand: { $regex: query, $options: 'i' } },// Tìm kiếm theo brand (không phân biệt chữ hoa/chữ thường)
          { category: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;