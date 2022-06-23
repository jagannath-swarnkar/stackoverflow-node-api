import mongoose from "mongoose";
require("dotenv").config();

console.info("connecting to db..............");
mongoose.connect(
    process.env.DB_CONNECTION,
    {
        keepAlive: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    },
    (err) => {
        if (err) {
            console.error("DB Error!", err);
        } else {
            console.info("DB connected!");
        }
    }
);
