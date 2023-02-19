const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./index");

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.DB)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
