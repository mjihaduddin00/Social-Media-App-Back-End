const mongoose = require("mongoose");
let uuidv1 = require('uuidv1')
 
console.log(uuidv1())
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

//Virtual Fields Are Additional Fields For A Given Model
//Their Values Can Be Set Manually Or Automatically With Defined Functionality
//Virtual Properties (Password) Don't Get Persisted In The Database
//They Only Exist Logically And Are Not Written To The Document's Collection

//Virtual Field
userSchema.virtual('password')
.set(function(password) {
    //Create Temporary Variable Called _password
    this._password = password
    //Generate A Timestamp
    this.salt = uuidv1()
    //Encrypt The Password
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//Methods
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password) {
        if(!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);