import mongoose, { Document,  Schema } from "mongoose";


export interface WishList extends Document {
  user: mongoose.Types.ObjectId;
  products:mongoose.Types.ObjectId[] 
}


const wishlistSchema = new Schema<WishList>({
  user:{type: Schema.Types.ObjectId, ref:"User", required:true},
  products:[{type: Schema.Types.ObjectId, ref:'Product'}],
},{timestamps:true})


export default mongoose.model<WishList>('Wishlist',wishlistSchema);


