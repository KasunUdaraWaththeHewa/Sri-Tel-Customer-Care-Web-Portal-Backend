const Account = require("../models/Account");
const ApiResponse = require("../dto/responseDto");
const { checkExistingUser } = require("../functions/checkExistingUser");
const { captureToken } = require("../functions/captureToken");

const createAccount = async (req, res) => {
  try {
    const { email, number, userID, accountType } = req.body;
    const token = captureToken(req);
    const existingUser = checkExistingUser(email, token);
    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      res.status(404).json(response);
      return;
    }
    try {
      const newAccount = new Account({
        email,
        number,
        userID,
        accountType,
      });
      await newAccount.save();
      const response = new ApiResponse(
        true,
        201,
        "Account created successfully",
        newAccount
      );
      res.status(201).json(response);
      return;
    } catch (error) {
      console.error("Error creating account:", error.message);
    }
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
    return;
  }
};

const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { email, accountType, number } = req.body;

  try {
    const existingUser = await checkExistingUser(email);

    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      return res.status(404).json(response);
    }

    const updateData = {};
    if (accountType) updateData.accountType = accountType;
    if (number) updateData.number = number;

    const updatedAccount = await Account.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAccount) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          "Account updated successfully",
          updatedAccount
        )
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};


const activateAccount = async (req, res) => {
  const { accountID, email } = req.body;

  try {
    const existingUser = checkExistingUser(email);

    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      return res.status(404).json(response);
    }

    const account = await Account.findById(accountID);

    if (!account) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }

    if (account.status === "Active") {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Account is already active", null));
    }

    account.status = "Active";
    await account.save();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Account activated successfully", null));
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const deactivateAccount = async (req, res) => {
  const { accountID, email } = req.body;

  try {
    const existingUser = checkExistingUser(email);

    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      return res.status(404).json(response);
    }

    const account = await Account.findById(accountID);

    if (!account) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }

    if (account.status === "Inactive") {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Account is already inactive", null));
    }

    account.status = "Inactive";
    await account.save();

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Account deactivated successfully", null)
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const suspendAccount = async (req, res) => {
  const { accountID, email } = req.body;

  try {
    const existingUser = checkExistingUser(email);

    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      return res.status(404).json(response);
    }

    const account = await Account.findById(accountID);

    if (!account) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }

    if (account.status === "Suspended") {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, "Account is already suspended", null)
        );
    }

    account.status = "Suspended";
    await account.save();

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Account suspended successfully", null));
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const getAllAccountsForCustomer = async (req, res) => {
  const { email } = req.params;

  try {
    const existingUser = checkExistingUser(email);

    if (!existingUser) {
      const response = new ApiResponse(false, 404, "User not found.", null);
      return res.status(404).json(response);
    }

    const accounts = await Account.find({ email: email });

    if (!accounts.length) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            false,
            404,
            "No accounts found for this customer",
            null
          )
        );
    }

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Accounts retrieved successfully", accounts)
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();

    if (!accounts.length) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "No accounts found", null));
    }

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Accounts retrieved successfully", accounts)
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const getAccountDetails = async (req, res) => {
  const { accountID } = req.params;

  try {
    const account = await Account.findById(accountID);

    if (!account) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Account retrieved successfully", account)
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

const isExistingAccount = async (req, res) => {
  const { accountID } = req.params;

  try {
    const account = await Account.findById(accountID);
    if (!account) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "Account not found", null));
    }
    res
      .status(200)
      .json(
        new ApiResponse(true, 200, "Account retrieved successfully", account)
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(false, 400, error.message, null));
  }
};

module.exports = {
  createAccount,
  updateAccount,
  activateAccount,
  deactivateAccount,
  suspendAccount,
  getAllAccountsForCustomer,
  getAccountDetails,
  isExistingAccount,
  getAllAccounts,
};
