const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB);

  console.log(
    `Database Connected: ${conn.connection.host}`.magenta.underline.bold
  );
};

module.exports = connectDB;
