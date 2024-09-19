const Subscription = require("../models/Subscription");
const ApiResponse = require("../dto/responseDto");
const { decodeToken } = require('../functions/decodeToken'); 


const createSubscription = async (req, res) => {
  const { name, description, price, durationInDays, features } = req.body;
  try {
    const subscription = new Subscription({
      name,
      description,
      price,
      durationInDays,
      features
    });

    await subscription.save();

    const response = new ApiResponse(true, 201, "Subscription created successfully!", subscription);
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while creating subscription.", null);
    res.status(500).json(response);
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    
    const response = new ApiResponse(true, 200, "Subscriptions retrieved successfully!", subscriptions);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving subscriptions.", null);
    res.status(500).json(response);
  }
};

const getSubscriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      const response = new ApiResponse(false, 404, "Subscription not found", null);
      return res.status(404).json(response);
    }

    const response = new ApiResponse(true, 200, "Subscription retrieved successfully!", subscription);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while retrieving subscription.", null);
    res.status(500).json(response);
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, durationInDays, features } = req.body;
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { name, description, price, durationInDays, features },
      { new: true }
    );
    
    if (!subscription) {
      const response = new ApiResponse(false, 404, "Subscription not found", null);
      return res.status(404).json(response);
    }

    const response = new ApiResponse(true, 200, "Subscription updated successfully!", subscription);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while updating subscription.", null);
    res.status(500).json(response);
  }
};

const deleteSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findByIdAndDelete(id);
    
    if (!subscription) {
      const response = new ApiResponse(false, 404, "Subscription not found", null);
      return res.status(404).json(response);
    }

    const response = new ApiResponse(true, 200, "Subscription deleted successfully!", subscription);
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse(false, 500, "Server error while deleting subscription.", null);
    res.status(500).json(response);
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
