import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Product } from '../models/product';
import dotenv from 'dotenv';

dotenv.config();

interface RequestWithUser extends Request {
    user?: {
        id: string;
    };
}

export const getAllProducts: RequestHandler = async (req, res, next) => {
    try {
        const allProducts: Product[] = await Product.findAll();

        return res
            .status(200)
            .json({ message: "Products fetched successfully", data: allProducts });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createProduct: RequestHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const newProduct = await Product.create({
            ...req.body,
            user_id: userId,
        });

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};