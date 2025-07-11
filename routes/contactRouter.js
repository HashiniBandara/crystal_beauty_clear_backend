import express from "express";
import { getAllContactMessages, submitContactForm } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", submitContactForm);
contactRouter.get("/", getAllContactMessages);

export default contactRouter;
