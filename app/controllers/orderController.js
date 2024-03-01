const Product = require('../models/productModel')
const Order = require('../models/orderModel')

const store = async (req,res, next) => {
    let {id} = req.params
    
    const product = await Product.findById(id)
    let idProduct = product._id
    let amount = product.pd_price
    try {
        const order = new Order({
            or_pd_id : idProduct,
            or_amount : amount
        })
        await order.save()
        return res.json(order)
    } catch (error) {
        
    }
}
const index = async (req, res, next) => {
    try {
      let { skip = 0, limit = 40 } = req.query; 
      let order = await Order.find()
        .populate('or_pd_id')
        .skip(parseInt(skip))
        .limit(parseInt(limit)); 
      return res.json(order);
    } catch (error) { 
      next(error);
    }
  };
  const destroy = async (req, res, next) => {
    try {
      let order = await Order.findOneAndDelete({ _id: req.params.id });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      return res.json(order);
    } catch (error) {
      next(error);
    }
};

module.exports = {store, index,destroy}