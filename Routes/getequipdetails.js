import express from "express";
import {getequipdetails} from "../controllers/getequipdetails.js";
import {postsparedetails} from "../controllers/getequipdetails.js";

const router= express.Router()

router.get("/getequipdetails", getequipdetails)
router.post("/postequipdetails", postsparedetails)

export default router