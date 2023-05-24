import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import connection from "./db/config";
import { json, urlencoded } from "body-parser";

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/user", userRoutes);

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.status(500).json({ message: err.message });
    }
);

connection
    .sync()
    .then(() => {
        console.log("Database successfully connected");
    })
    .catch((err) => {
        console.log("Error", err);
    });

app.listen(3000, () => {
    console.log("Welcome to the user and products api! working on port 3000");
});