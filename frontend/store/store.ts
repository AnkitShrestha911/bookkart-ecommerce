import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import checkoutReducer from "./slice/checkoutSlice";
import storage from "redux-persist/lib/storage";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PURGE,
	PERSIST,
	REGISTER,
} from "redux-persist";
//persist configuration
const userPersistConfig = {
	key: "user",
	storage,
	whiteList: ["user", "isEmailVerified", "isLoggedIn"],
};

const cartPersistConfig = {
	key: "cart",
	storage,
	whiteList: ["items"],
};

const wishlistPersistConfig = {
	key: "wishlist",
	storage
};

const checkoutPersistConfig = {
	key: "checkout",
	storage
};

//wrap reducer with persist config

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishListReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckOutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);

export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer, // rtk api query
		user: persistedUserReducer,
		cart:persistedCartReducer,
		wishlist:persistedWishListReducer,
		checkout:persistedCheckOutReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
			},
		}).concat(api.middleware),
});

//setup listener for rtk query
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
