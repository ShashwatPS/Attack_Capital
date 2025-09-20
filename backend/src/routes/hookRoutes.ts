import { preCall } from "../controllers/preCall.js";
import { getEmployee } from "../controllers/inCall.js";
import express from "express";
import { postCall } from "../controllers/postCall.js";

const router = express.Router();

router.post('/precall', preCall);
router.post('/getData', getEmployee);
router.post('/postcall', postCall);

export default router;
