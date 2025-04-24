const mongoose = require("mongoose");
const generate = require("../../../helpers/generate.helper");

const UserSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateRandomString(30)
        },
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