import express from "express";
import cors from "cors";
require("dotenv").config();
require("./connections/db");
import routes from "./routes";

const PORT = process.env.PORT || "8000";
const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
});
