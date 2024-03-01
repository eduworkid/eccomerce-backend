const Category = require('../models/categoryModel');

const store = async(req, res, next) => {
    let payload = req.body;
    try {
        let category = new Category(payload);
        await category.save()
        res.json(category)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
  
}
const update = async(req, res, next) => {
    let payload = req.body;
    let {id} = req.params
    try {
        let category = await Category.findByIdAndUpdate({_id : id},payload,{
            new : true,
            runValidations : true
        })
        res.json(category)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
  
}
const destroy = async (req,res, next) => {
    try {
        let category = await Category.findOneAndDelete({ _id: req.params.id })
        return res.json(category)
    } catch (error) {
        next(error)
    }
}
const show = async (req,res, next) => {
    try {
        let category = await Category.findOne({ _id: req.params.id })
        if (!category) {
            return res.status(400).json({
                msg: "category not Found"
            })
        }
        return res.status(200).json(category)
    } catch (error) {
        
        next(error)
    }
}
const index = async (req,res, next) => {
    try {
        let {skip = 0, limit = 10} = req.query;
        let category = await Category
        .find()
        .skip(parseInt(skip))
        .limit(parseInt(limit));
        return res.json(category)
    } catch (error) {
        next(error)
    }
}
module.exports = {store, update, index, destroy,show}