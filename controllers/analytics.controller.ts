import {Request,Response,NextFunction} from "express";
import ErrorHandler from "../utils/ErrorHandler";

import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthData } from "../utils/analytics.generator";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get user analytics --only admin

export const getUserAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const users =await generateLast12MonthData(UserModel);
        res.status(200).json({
            success:true,
            users
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
})

// Get courses analytics --only for admin

export const getCoursesAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const courses =await generateLast12MonthData(CourseModel);
        res.status(200).json({
            success:true,
            courses
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
})

// Get orders analytics --only for admin

export const getOrdersAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const orders =await generateLast12MonthData(OrderModel);
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
})