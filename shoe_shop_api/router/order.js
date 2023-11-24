const Order = require("../model/order");
const Product = require('../model/product');
const router = require("express").Router();
const Cart = require("../model/cart");


// router.post("/add", async (req, res) => {
//     const newOrder = new Order(req.body);
  
//     try {
//       const savedOrder = await newOrder.save();
//       res.status(200).json(savedOrder);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


router.post("/add", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
      for(const productItem of req.body.products){
          const productData = await Product.findById(productItem.productId);
          // const a1 = productData.packing;
          // if (a1 && a1.length > 0) {
          //   const lastSize = a1[0].size[a1[0].size.length - 1];
          //   console.log(lastSize);
          // }

          if(!productData){
              return res.status(404).json({message: "Sản phẩm không tồn tại"});
          }
          const packing = productData.packing;
          const color = productItem.color;
          const checkColor = packing.find(
                  (item) => item.color.toString() === color
              );

          if(!checkColor){
                  return res.status(404).json({message: "Màu không toàn tại"});
          }

          
          for(const sizeDta of checkColor.size ){
            // console.log(sizeDta.value);
            // console.log(productItem.size);
              if(sizeDta.value == productItem.size){
                // console.log("====");
                if(sizeDta.remaining < productItem.quantity){
                  return res.status(400).json({message: productItem.title +" Số lượng không đủ"});
                }
              sizeDta.remaining -= productItem.quantity;
              break;
              }

          }
          const updatedProduct = await productData.save();
          console.log("Sản phẩm đã được cập nhật thành công");
          const editedCart = await Cart.findOneAndUpdate({  _id: req.body.cartId }, { status: "completed" });
          if (!editedCart) {
              return res.status(404).json({ message: "Cart không tồn tại" });
          }
          console.log("Cart đã được chỉnh sửa thành công");
          const savedOrder = await newOrder.save();
          console.log("Order đã được lưu thành công");
          res.status(200).json(savedOrder);

          //   if (a1 && a1.length > 0) {
          //   const lastSize = a1[0].size[a1[0].size.length - 1];
          //   console.log(lastSize);
          // }

      }
  } catch (err) {
      res.status(500).json(err);
  }
})




  router.put("/:id",   async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });




  router.delete("/:id",   async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("Order has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/find/:userId", async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId })
      .sort({ status: -1, updatedAt: -1, createdAt: -1 });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

  router.get("/",   async (req, res) => {
    try {
      const orders = await Order.find().sort({ status: -1 , createdAt: 1 });;
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/income",   async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;