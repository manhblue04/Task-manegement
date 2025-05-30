const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password");

const generateHelper = require("../../../helpers/generate.helper");
const sendMailHelper = require("../../../helpers/sendMail.helper");

//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email da ton tai"
        });
    } else {

        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generateRandomString(30)
        });

        user.save();

        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "tao tai khoan thanh cong",
            token: token
        });
    }
};

//[POST] /api/v1/user/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: "email ko ton tai"
        })
        return;
    }

    if (md5(password) !== user.password) {
        res.json({
            code: 400,
            message: "Sai mat khau"
        })
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Dang nhap thanh cong",
        token: token
    });
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        });
    }

    const otp = generateHelper.generateRandomNumber(8);
    const timeExpire = 5; // phút

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60 * 1000 // đổi sang milliseconds
    };

    try {
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `
            <p>Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút)</p>
            <p>Vui lòng không chia sẻ mã OTP này với bất kỳ ai.</p>
        `;

        await sendMailHelper.sendMail(email, subject, html);

        return res.json({
            code: 200,
            message: "Đã gửi mã OTP qua email"
        });

    } catch (error) {
        console.error("Lỗi trong forgotPassword:", error);
        return res.json({
            code: 500,
            message: "Có lỗi xảy ra. Không thể gửi mã OTP."
        });
    }
};

//[POST] /api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        res.json({
            code: 400,
            message: "OTP không tồn tại!"
        });
        return;
    }
    const user = await User.findOne({
        email: email
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xác thực thành công",
        token: token
    });
}

//[POST] /api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;// const token = req.cookies.token;
    const password = req.body.password;
    const user = await User.findOne({
        token: token,
        deleted: false
    });

    if (md5(password) === user.password) {
        res.json({
            code: 400,
            message: "Vui long nhap mat khau moi khac mat khau cu"
        })
        return;
    }

    await User.updateOne({
        token: token
    }, {
        password: md5(password)
    });

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công!"
    });
}

//[GET] /api/v1/user/detail
module.exports.detail = async (req, res) => {
    // const token = req.cookies.token;

    res.json({
        code: 200,
        message: "Thành công!",
        info: req.user
    });
}

// [GET] /api/v1/user/list
module.exports.list = async (req, res) => {
    const users = await User.find({
        deleted: false
    }).select("id fullName email");

    res.json({
        code: 200,
        message: "Thành công!",
        users: users
    });
}
