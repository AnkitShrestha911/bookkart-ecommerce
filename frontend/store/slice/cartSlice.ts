import { CartItem } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
	_id: string;
	user: string;
	items: CartItem[];
	createdAt: string;
	updatedAt: string;
}

const initialState: CartState = {
	_id: "",
	user: "",
	items: [],
	createdAt: "",
	updatedAt: "",
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setCart: (state, action: PayloadAction<any>) => {
			return { ...state, ...action.payload };
		},

		addToCart: (state, action: PayloadAction<any>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.items[index].quantity += 1;
			} else {
				return { ...state, ...action.payload };
			}
		},

		removeFromCart: (state, action: PayloadAction<any>) => {
			state.items = state.items.filter((item) => item._id !== action.payload._id);
		},

		decrementItem: (state, action: PayloadAction<any>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				if (state.items[index].quantity > 1) {
					state.items[index].quantity -= 1;
				} else {
					state.items.splice(index, 1); // remove item
				}
			}
		},

		clearCart: (state) => {
			state._id = "";
			state.createdAt = "";
			state.items = [];
			state.user = "";
			state.updatedAt = "";
		},
	},
});

export const { addToCart, removeFromCart, decrementItem, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
