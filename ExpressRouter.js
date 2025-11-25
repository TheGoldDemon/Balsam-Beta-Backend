//============================================================================================//
// Libraries
import Express from "express";

import "dotenv/config";

import cors from "cors"
import {
  CreateUser,
  RetrieveUser,
  UpdateUser,
  DeleteUser,
  LoginUser,
  AutoLogin
} from "./UserDataFunctions.js";

import {
  CreateDrug,
  RetrieveUserDrugs,
  UpdateDrugData,
  DeleteDrugData,
  fetchGudeaDrugData
} from "./UserDrugFunctions.js";

import { MessageRequest } from "./AISetup.js";   // <-- Added
//============================================================================================//
// Init
const App = Express();
//============================================================================================//
// Middleware
App.use(Express.json({ limit: "20mb" })); // increase limit for base64 images
App.use(Express.urlencoded({ limit: "20mb", extended: true }));

// configure CORS for your frontend
App.use(cors());
//============================================================================================//
// USER ROUTES
//============================================================================================//

// Create User (Register)
App.post("/auth/register", async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password, BirthDate, Gender, PhoneNumber } = req.body;

    const id = await CreateUser(
      FirstName,
      LastName,
      Email,
      Password,
      BirthDate,
      Gender,
      PhoneNumber
    );

    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create user" });
  }
});

// Login
App.post("/auth/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const id = await LoginUser(Email, Password);

    if (!id) return res.status(401).json({ success: false, error: "Invalid login" });

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// Auto-login
App.post("/auth/auto-login", async (req, res) => {
  try {
    const { idCookie } = req.body;
    const id = await AutoLogin(idCookie);

    if (!id) return res.json({ success: false });

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: "Auto-login failed" });
  }
});

// Get user data
App.get("/user/:id", async (req, res) => {
  try {
    const user = await RetrieveUser(req.params.id);

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to retrieve user" });
  }
});

// Update user
App.patch("/user/:id", async (req, res) => {
  try {
    const updatedUser = await UpdateUser(req.params.id, req.body);
    res.json({ success: true, updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

// Delete user
App.delete("/user/:id", async (req, res) => {
  try {
    const { password } = req.body;

    const result = await DeleteUser(req.params.id, password);

    if (!result) return res.status(401).json({ success: false, error: "Invalid password" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
});

//============================================================================================//
// DRUG ROUTES
//============================================================================================//

// Create drug manually
App.post("/drugs/create", async (req, res) => {
  try {
    const {
      UserId,
      BrandName,
      ScientificName,
      PurchaseDate,
      ExpirationDate,
      PurchasePrice,
      SellingPrice,
      Quantity,
      Location,
      Tags,
      Group
    } = req.body;

    const drug = await CreateDrug(
      UserId,
      BrandName,
      ScientificName,
      PurchaseDate,
      ExpirationDate,
      PurchasePrice,
      SellingPrice,
      Quantity,
      Location,
      Tags,
      Group
    );

    res.status(201).json({ success: true, drug });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create drug" });
  }
});

// Retrieve all drugs
App.get("/drugs/:UserId", async (req, res) => {
  try {
    const drugs = await RetrieveUserDrugs(req.params.UserId);
    res.json({ success: true, drugs });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to retrieve drugs" });
  }
});

// Update drug
App.patch("/drugs/update/:id", async (req, res) => {
  try {
    const { UserId, updates } = req.body;

    const updated = await UpdateDrugData(req.params.id, UserId, updates);
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update drug" });
  }
});

// Delete drug
App.delete("/drugs/delete/:id", async (req, res) => {
  try {
    const { UserId } = req.body;

    const deleted = await DeleteDrugData(req.params.id, UserId);
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete drug" });
  }
});

// QR drug insert
App.post("/drugs/qr", async (req, res) => {
  const { qrCode, UserId } = req.body;

  try {
    const result = await fetchGudeaDrugData(qrCode, UserId);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({ success: true, result: result.drug });
  } catch (err) {
    console.error("Unhandled QR error:", err);
    res.status(500).json({ success: false, error: "Server error fetching Gudea data" });
  }
});
//============================================================================================//
// AI CHAT ROUTE
//============================================================================================//

App.post("/ai/message", async (req, res) => {
  try {
    const { UserId, MessageContent, ImageBase64 } = req.body;

    if (!UserId || !MessageContent || !ImageBase64)
      return res.status(400).json({ success: false, error: "UserId, MessageContent and ImageBase64 are required" });

    // Pass structured object to agent
    const response = await MessageRequest({ UserId, MessageContent, ImageBase64 });

    res.json({ success: true, response: response.assistant, createdDrug: response.createdDrug });
  } catch (err) {
    console.error("AI request failed:", err);
    res.status(500).json({ success: false, error: "AI request failed" });
  }
});

//============================================================================================//
// Listen
//============================================================================================//
App.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
//============================================================================================//