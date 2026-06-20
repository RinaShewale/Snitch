import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

// ======================
// GET CART WITH TOTAL (AGGREGATION)
// ======================


export const getCartWithTotal = async (userId) => {
    const cart = await Cart.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },

        { $unwind: "$items" },

        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product",
            },
        },

        { $unwind: "$product" },

        { $unwind: "$product.variants" },

        {
            $match: {
                $expr: {
                    $eq: ["$items.variant", "$product.variants._id"],
                },
            },
        },

        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            "$items.quantity",
                            "$product.variants.price.amount",
                        ],
                    },
                    currency: "$product.variants.price.currency",
                },
            },
        },

        {
            $group: {
                _id: "$_id",

                totalPrice: { $sum: "$itemPrice.price" },
                currency: { $first: "$itemPrice.currency" },

                items: {
                    $push: {
                        _id: "$items._id",
                        product: "$product",
                        variant: "$items.variant",
                        quantity: "$items.quantity",
                        selectedAttributes: "$items.selectedAttributes",
                        price: "$items.price",
                    },
                },
            },
        },
    ]);

    if (!cart.length) {
        return {
            items: [],
            totalPrice: 0,
            currency: "INR",
        };
    }

    return cart[0];
};