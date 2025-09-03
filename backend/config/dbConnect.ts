import mongoose from "mongoose";



const connectDB = async (): Promise<void> => {
	try {
		const connection = await mongoose.connect(process.env.MONGODB_URI as string);
		console.log("mongodb is connected succesfully.",connection.connection.host);
	} catch (err) {
		console.log(err);
	}
};

export default connectDB;


