const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);


const orderSchema = Schema(
  {
    or_id: {
      type: Number,
    },
    or_pd_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
       
    },
    or_amount: {
      type: Number,
      default: 0,
  
    },
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "or_id" });

module.exports = model("Order", orderSchema);
