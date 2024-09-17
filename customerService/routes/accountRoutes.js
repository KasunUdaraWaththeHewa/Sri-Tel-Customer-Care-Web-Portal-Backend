const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.post("/", accountController.createAccount);
router.put("/:id", accountController.updateAccount);
router.post("/activate/:email", accountController.activateAccount);
router.post("/deactivate/:email", accountController.deactivateAccount);
router.post("/suspend/:email", accountController.suspendAccount);
router.get("/customer/:email", accountController.getAllAccountsForCustomer);
router.get("/:accountID", accountController.getAccountDetails);
router.get("/check/:accountID", accountController.isExistingAccount);

module.exports = router;
