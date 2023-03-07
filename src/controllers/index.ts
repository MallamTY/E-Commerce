import { checkout } from "./checkout";
import { addDeliveryFee, 
        removeDeliveryFee, 
        updateDeliveryFee 
    } from "./deliveryController";

import { logIn,
        verifyEmail,
        resendEmailVerificiationLink,
        verifyOTP,
        resendOTP,
        forgetPassword,
        resetPassword,
        updateUserProfile,
        updatedProfilePicture 
    } from "./authController";

import { cartProduct,
        decreaseCartByOne,
        increaseCartByOne,
        getCartedProduct,
        deleteProductFromCart,
        deleteCart
    } from "./cartController";

import { addOrRemoveProductToFavourite,
        getFavourite,
        checkProductFromFavourite,
        deleteFavourite,

    } from "./favouriteController";

import { uploadProduct,
        updateProduct,
        getProduct,
        getAllProduct,
        deleteProduct
    } from "./productController";

import { registerUser,
        getUser,
        getAllUser,
        deleteUser
    } from "./userController";





export const User = {
    registerUser,
    getUser,
    getAllUser,
    deleteUser
}
export const Product = {
    uploadProduct,
    updateProduct,
    getProduct,
    getAllProduct,
    deleteProduct
}

export const Checkout = {
    checkout
}

export const Delivery = {
    addDeliveryFee,
    removeDeliveryFee,
    updateDeliveryFee
}

export const Auth = {
    logIn,
    verifyEmail,
    resendEmailVerificiationLink,
    verifyOTP,
    resendOTP,
    forgetPassword,
    resetPassword,
    updateUserProfile,
    updatedProfilePicture
}

export const Cart = {
    cartProduct,
    decreaseCartByOne,
    increaseCartByOne,
    getCartedProduct,
    deleteProductFromCart,
    deleteCart
}

export const Favourite = {
    addOrRemoveProductToFavourite,
    getFavourite,
    deleteFavourite,
    checkProductFromFavourite
}