const express = require("express");
const {
  createDataPackage,
  getAllDataPackages,
  getDataPackageById,
  updateDataPackage,
  deleteDataPackage,
} = require("../controllers/dataPackageController");
const router = express.Router();

router.post("/data-packages", createDataPackage);
router.get("/data-packages", getAllDataPackages);
router.get("/data-packages/:id", getDataPackageById);
router.put("/data-packages/:id", updateDataPackage);
router.delete("/data-packages/:id", deleteDataPackage);
module.exports = router;
