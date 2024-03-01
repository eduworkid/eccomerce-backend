const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { model, Schema } = mongoose;

let categorySchema = Schema({
    ct_id: {
        type: Number
    },
    ct_code: {
        type: String,
        maxlength: [5],
        unique: true
    },
    ct_name: {
        type: String,
        minlength: [3, "Minimal 3 karakter"],
        maxlength: [20, "Maksimal 20 karakter"],
        required: [true, "Kategori harus diisi"]
    }
}, { timestamps: true });

categorySchema.plugin(AutoIncrement, { inc_field: 'ct_id' });

categorySchema.pre('save', async function(next) {
    const category = this;
    if (!category.ct_code) {
        const latestCategory = await mongoose.model('Category').findOne({}, {}, { sort: { 'createdAt': -1 } });
        const lastCode = latestCategory ? latestCategory.ct_code : 'A000'; 
        let newCode = '';
        const lastLetter = lastCode.charAt(0);
        const lastNumber = parseInt(lastCode.substring(1));

        if (lastNumber < 999) {
            newCode = lastLetter + ('00' + (lastNumber + 1)).slice(-3);
        } else {
            newCode = String.fromCharCode(lastLetter.charCodeAt(0) + 1) + '001';
        }
        category.ct_code = newCode;
    }

    next();
});

module.exports = model("Category", categorySchema);
