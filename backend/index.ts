import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import cookiesParser from "cookie-parser"
import connectDB from "./config/dbConnect"
import authRoutes from "./routes/authRoutes"
import productRoutes from "./routes/productRoutes"
import cartRoutes from "./routes/cartRoutes"
import wishlistRoutes from "./routes/wishlistRoutes"
import addressRoutes from "./routes/addressRoutes"
import userRoutes from "./routes/userRoutes"
import orderRoutes from "./routes/orderRoutes"
import passport from "./controllers/strategy/googleStragegy"


dotenv.config();
const PORT = process.env.PORT || 4000
connectDB();
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials:true
}



app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());
app.use(passport.initialize());


// Api endpoints

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT,() => {
  console.log("listening on port: ",PORT);
})




