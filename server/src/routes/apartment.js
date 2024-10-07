import express from "express";
import {
  createApartment,
  getApartments,
  getApartmentsForm,
  deleteApartment,
  updateApartment,
  getApartment,
} from "../controllers/apartment_controller.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/create", createApartment);
router.get("/get", auth, getApartments);
router.get("/getForm", getApartmentsForm);
router.get("/get/:id", getApartment);
router.post("/update/:id", updateApartment);
router.delete("/delete/:id", deleteApartment);

export default router;
