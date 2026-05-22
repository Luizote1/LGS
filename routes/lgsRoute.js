const express = require("express");
const router = express.Router();

const LgsController = require("../controllers/lgsControllers");

let ctrl = new LgsController();

router.get("/", ctrl.index);

module.exports = router;    