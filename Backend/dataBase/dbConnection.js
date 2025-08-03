import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}`);
    console.log("DB connection success");
  } catch (error) {
    console.log("Error at Database connection", error);
  }
};
export default dbConnection;
