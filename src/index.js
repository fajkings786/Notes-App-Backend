import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import app from "./app.js";
import ConnectDB from "./db/db.js";
const PORT = process.env.PORT || 8000;


app.use((err, req, res, next) => {
  console.log(`Your current error is ${err}`);
  const statusCode = err.statusCode || 500;
  
  return res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null
  });
});

ConnectDB()
  .then(function () {
    app.on("error", (error) => {
      console.log(`error ${error}`);
      throw error;
    });
    app.listen(PORT, function () {
      console.log(`Your app is listen  on the PORT of ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database", err);
  });
