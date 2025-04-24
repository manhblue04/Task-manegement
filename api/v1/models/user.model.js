const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deleteAt: Date
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", UserSchema, "users");

module.exports = User;