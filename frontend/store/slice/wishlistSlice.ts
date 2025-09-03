import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishListItem {
  _id:string;
  products:string[];
}

interface WishListState {
  items:WishListItem[];
}

const initialState:WishListState = {
  items:[],
}

const wishlistSlice = createSlice({
  name:'wishlist',
  initialState,
  reducers: {
    setWishList:(state,action:PayloadAction<any>) => {
      state.items = action.payload;
    },

    clearWishlist:(state) => {
      state.items = [];
    },
    addToWishList:(state,action:PayloadAction<any>) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if(index !== -1) {
         state.items[index] = action.payload;
      }
      else{
        state.items.push(action.payload);
      }
    },

    removeFromWishList:(state,action:PayloadAction<any>) => {
      state.items = state.items.map((item) => {
        return {
          ...item,
          products:item.products.filter((productId) => productId !== action.payload)
        }
      }).filter(item => item.products.length > 0);
    }


  }
})

export const  {setWishList,addToWishList,clearWishlist,removeFromWishList } = wishlistSlice.actions;
export default wishlistSlice.reducer;