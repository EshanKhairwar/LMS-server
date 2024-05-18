// get user by id
import { Response } from "express";
import UserModel from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get All users

export const getAllUsersService = async (res: Response) => {
  const users=await UserModel.find().sort({createdAt:-1});

  res.status(201).json({
    success:true,
    users
  })
};

// Update user role service

export const updateUserRoleService=async(res:Response,id:string,role:string)=>{
  const user=await UserModel.findByIdAndUpdate(id,{role},{new:true});
  res.status(201).json({
    success:true,
    user,
  })
};
