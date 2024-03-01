const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    pd_id: {
      type: Number,
    },
    pd_code: {
      type: String,
      maxlength: 5,
      unique: true,
    },
    pd_ct_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    pd_name: {
      type: String,
      minlength: 3,
      required: true,
    },
    pd_price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
productSchema.plugin(AutoIncrement, { inc_field: 'pd_id' });
productSchema.pre('save', async function(next) {
  const product = this;
  if (!product.pd_code) {
    try {
      const latestProduct = await model('Product').findOne().sort({ 'pd_code': -1 }).limit(1);
      let newCode;
      if (!latestProduct) {
        newCode = 'A0001';
      } else {
        const lastNumber = parseInt(latestProduct.pd_code.substring(1));
        if (lastNumber < 999) {
          newCode = 'A' + ('000' + (lastNumber + 1)).slice(-3);
        } else {
          throw new Error('Maximum product code limit reached');
        }
      }
      product.pd_code = newCode;
    } catch (error) {
      next(error); // Pass error to the next middleware
      return;
    }
  }
  next();
});

module.exports = model("Product", productSchema);
