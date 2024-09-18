const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAllAccounts);
router.post("/", accountController.createAccount);
router.put("/:id", accountController.updateAccount);
router.post("/activate", accountController.activateAccount);
router.post("/deactivate", accountController.deactivateAccount);
router.post("/suspend", accountController.suspendAccount);
router.get("/customer/:email", accountController.getAllAccountsForCustomer);
router.get("/:accountID", accountController.getAccountDetails);
router.get("/check/:accountID", accountController.isExistingAccount);

module.exports = router;
