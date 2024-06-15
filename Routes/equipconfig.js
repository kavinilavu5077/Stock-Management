import express from "express";
import {equipmentConfiguration} from "../controllers/equipconfig.js";

const router= express.Router()


router.post("/equipconfig", equipmentConfiguration)
export default router