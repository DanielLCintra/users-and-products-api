import { RequestHandler } from "express";

import { User } from "../models/user";
import { UserAddress } from "../models/userAddress";
import { Product } from "../models/product";

export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const allUser: User[] = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [UserAddress],
        });

        return res
            .status(200)
            .json({ message: "Users fetched successfully", data: allUser });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user: User | null = await User.findByPk(id,{
            attributes: { exclude: ['password'] },
            include: [UserAddress], 
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        return res
            .status(200)
            .json({ message: "User fetched successfully", data: user });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user: User | null = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.update({ ...req.body }, { where: { id } });

        if (req.body.address) {
            const { zipcode, street, state, city, number } = req.body.address;
            await UserAddress.update({ zipcode, street, state, city, number }, { where: { user_id: id } });
        }

        const updatedUser: User | null = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [UserAddress], 
        });

        return res
            .status(200)
            .json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user: User | null = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserAddress.destroy({ where: { user_id: id } });
        await Product.destroy({ where: { user_id: id } });
        await User.destroy({ where: { id } });

        return res
            .status(200)
            .json({ message: 'User deleted successfully', data: user });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserProducts: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.userId;

        const user: User | null = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const allUserProducts: Product[] = await Product.findAll({
            where: {
                user_id: id,
            },
        });

        return res
            .status(200)
            .json({ message: "User Products fetched successfully", data: allUserProducts });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};