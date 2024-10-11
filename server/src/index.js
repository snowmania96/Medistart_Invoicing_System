import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import managementRoutes from "./routes/management.js";
import guestRoutes from "./routes/guest.js";
import apartmentRoutes from "./routes/apartment.js";
import invoiceRoutes from "./routes/invoice.js";
import cron from "node-cron";
import { cronWork } from "./cron/cronWork.js";
import schemaRoutes from "./routes/schema.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/management", managementRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/apartment", apartmentRoutes);
app.use("/api/schema", schemaRoutes);
app.use("/api/invoice", invoiceRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);

//Node cron

cron.schedule(
  "46 16 * * *",
  async () => {
    const today = new Date().toISOString().split("T")[0];
    await cronWork("today");
  },
  {
    scheduled: true,
    timezone: "Europe/Rome",
  }
);
