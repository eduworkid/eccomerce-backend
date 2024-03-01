const mongoose = require('mongoose')
const {model,Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')
let userSchema = Schema({
    us_id : {
        type : Number
    },
    us_name: {
        type : String,
        minlength: [3, "minimal 3 karakter"],
        maxlength: [100, "maximal 100 karakter"],
        required : [true, "nama harus di isi"]
    },
    us_email : {
        type : String,
        required : [true, "harus isi email"],
        maxlength: [255, "maximal panjang email 255"]
    },
    us_password : {
        type : String,
        required : [true, "harus buat password"],
        maxlength: [255, "maximal panjang paswword 255"]
    },
    us_phone_number : {
        type : String,
        required : [true, "harus buat password"],
        maxlength: [15, "maximal panjang no telepon 15"],
        minlength : [9, "masukan no telepon yang sesuai"]
    },
    us_address : {
        type : String,
        required : [true, "harus mengisi alamat"],
        maxlength: [255, "maximal panjang paswword 255"]
    },
    
    token : String
}, {timestamps: true})

userSchema.path('us_email').validate(function(value){
    const EMAIL_RE = /^([\w-\-]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid`);

userSchema.path('us_email').validate(async function(value) {
    try {
        const existingUser = await this.constructor.findOne({ email: value });
        return !existingUser;
    } catch (error) {
        throw error;
    }
}, attr => `${attr.value} sudah terdaftar`);


const HASH_ROUND = 10;
userSchema.pre('save',function(next){
    this.us_password = bcrypt.hashSync(this.us_password, HASH_ROUND)
    next();
})
userSchema.plugin(AutoIncrement, {inc_field : 'us_id'});


module.exports = model('User', userSchema)