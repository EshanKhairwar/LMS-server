import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { IUser } from "../models/user.model";

// Define a new interface that extends the Request interface
interface AuthenticatedRequest extends Request {
  user?: IUser; // Define the user property
}

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    console.log(access_token);
    if (!access_token) {
      return next(new ErrorHandler("Please login to access this error", 400));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Please Login to access this resource", 400));
    }

    req.user = JSON.parse(user);

    next();
  }
);

// Validate user role

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resourcers`,
          400
        )
      );
    }
    next();
  };
};
