require("dotenv").config();

import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure?: boolean;
}

// Parse environment variables and integrate fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

// Options for cookies
const createTokenOptions = (expireTime: number): ITokenOptions => ({
  expires: new Date(Date.now() + expireTime * 1000),
  maxAge: expireTime * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production", // Only set secure to true in production
});

export const accessTokenOptions: ITokenOptions = createTokenOptions(accessTokenExpire * 60);
export const refreshTokenOptions: ITokenOptions = createTokenOptions(refreshTokenExpire * 24 * 60 * 60);

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Upload session to Redis
  try {
    await redis.set(user._id, JSON.stringify(user));
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to save session to Redis",
    });
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
