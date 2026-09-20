import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log("DB connected successfully now you can move.");
    console.log("DB HOST !!!!!");
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default ConnectDB;
 