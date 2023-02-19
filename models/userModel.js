const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALTS = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxLength: 100,
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        maxLength: 50,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        maxLength: 50,
        unique: true
    }
})

userSchema.pre('save', function(next) {
    let user = this;

    // hash if modified
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALTS, function(err, salt) {
        if (err) return next(err);

        // hash the password
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // replace password with hashed version
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function(newPassword, callback) {
    bcrypt.compare(newPassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema)