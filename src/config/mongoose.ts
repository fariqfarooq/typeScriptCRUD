import { connect, set } from "mongoose";
import { config } from "dotenv";
config();



const MONGO_DB_URL = process.env.MONGO_DB_URL;

export const connectDb = async () => {
    if (!MONGO_DB_URL) {
        throw new Error("MongoDB connection URL is not defined in the environment variables.");
    }
    //MONGO CONNECTION
    try {
        set("strictQuery", false);
        const db = await connect(MONGO_DB_URL);
        console.log("MongoDb connect to", db.connection.name);

    } catch (error) {
        console.log(error)
    }
}

