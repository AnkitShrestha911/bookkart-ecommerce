import { Request, Response } from "express";
import Product from "../models/Product";
import { response } from "../utils/responseHandler";
import CartItem, { ICartItem } from "../models/CartItem";

export const addToCart = async (req:Request, res:Response) => {
  try{
    const userId = req.userId;
    const {productId} = req.body;
    const product = await Product.findById(productId);
    if(!product) {
      return response(res,404,"Product not found!");
    }

    if(product.seller.toString() === userId) {
      return response(res,400,"You cannot add your own product in the cart");
    }

    let cart = await CartItem.findOne({user:userId});

    if(!cart) {
      cart = new CartItem({user:userId,items:[]});
    }

    const isItemExistInCart = cart.items.find((item) => item.product.toString() === productId);
    if(isItemExistInCart) {
      isItemExistInCart.quantity += 1;
    }else {
      const newItem = {
        product: productId,
        quantity: 1
      }
      cart.items.push(newItem as ICartItem);
    }

    await cart.save();
    return response(res,200,"Item added to your cart succesfully.",cart);

  }catch(err) {
    console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
  }
}

export const removeFromCart = async (req:Request, res:Response) => {
  try{
    const userId = req.userId;
    const {productId} = req.params;
    const cart = await CartItem.findOne({user:userId});
    if(!cart) {
      return response(res,404,"Cart not found for this user.");
    }

    const cartProduct = cart.items.find((item) => item.product.toString() === productId);
    if(!cartProduct) {
      return response(res,404,"Product not exist for this cart");
    }

    if(cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
    }
    else {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    }

    await cart.save();

    return response(res,200,"Item removed from cart succesfully.",cart);

    
  }catch(err) {
    console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
  }
}

export const removeProductFromCart = async (req:Request, res:Response) => {
  try{
    const userId = req.userId;
    const {productId} = req.params;
    const cart = await CartItem.findOne({user:userId});
    if(!cart) {
      return response(res,404,"Cart not found for this user.");
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return response(res,200,"Product removed from cart succesfully.",cart);
  }catch(err) {
    console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
  }
}

export const getCartByUser = async (req:Request, res:Response) => {
  try{
    const userId = req.params.userId;
    let cart = await CartItem.findOne({user:userId}).populate("items.product");
    if(!cart) {
      return response(res,404,"Cart is empty",{items:[]});
    }

    return response(res,200,"Cart fetched for this user",cart);
  }catch(err) {
    console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
  }
}

export const clearUserCart = async (req:Request, res:Response) => {
  try{
    const userId = req.params.userId;
    let cart = await CartItem.findOne({user:userId});
    if(!cart) {
      return response(res,404,"Cart is empty",{items:[]});
    }
    cart.items = [];
    await cart.save();
    return response(res,200,"Cart cleared for this user",cart);
  }catch(err) {
    console.log(err);
		return response(res, 500, "Internal Server Problem, Please try again.");
  }
}