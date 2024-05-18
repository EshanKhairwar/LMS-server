"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// Parse environment variables and integrate fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
// Options for cookies
const createTokenOptions = (expireTime) => ({
    expires: new Date(Date.now() + expireTime * 1000),
    maxAge: expireTime * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Only set secure to true in production
});
exports.accessTokenOptions = createTokenOptions(accessTokenExpire * 60);
exports.refreshTokenOptions = createTokenOptions(refreshTokenExpire * 24 * 60 * 60);
const sendToken = async (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // Upload session to Redis
    try {
        await redis_1.redis.set(user._id, JSON.stringify(user));
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to save session to Redis",
        });
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
