const express = require("express");
const {
  createDataTopUpPackage,
  getAllDataTopUpPackages,
  getDataTopUpPackageById,
  updateDataTopUpPackage,
  deleteDataTopUpPackage,
} = require("../controllers/dataTopUpPackageController");

const router = express.Router();

router.post("/packages", createDataTopUpPackage);
router.get("/packages", getAllDataTopUpPackages);
router.get("/packages/:id", getDataTopUpPackageById);
router.put("/packages/:id", updateDataTopUpPackage);
router.delete("/packages/:id", deleteDataTopUpPackage);

module.exports = router;
