import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import managementRoutes from "./routes/management.js";
import guestRoutes from "./routes/guest.js";
import apartmentRoutes from "./routes/apartment.js";
import cron from "node-cron";
import { cronWork } from "./cron/cronWork.js";
import {
  fetchReservationId,
  fetchReservationInfo,
} from "./cron/apiintegration/GuestyApi.js";

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
  "52 7 * * *",
  async () => {
    console.log("Cron Started");
    for (let i = 1; i <= 7; i++) {
      let day;
      if (i < 10) day = `2024-10-0${i}`;
      else day = `2024-09-${i}`;
      await cronWork(day);
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Rome",
  }
);
