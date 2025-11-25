//============================================================================================//
// Libraries
import { PrismaClient } from '@prisma/client';
import axios from "axios";
//============================================================================================//
// Init
const Prisma = new PrismaClient();
//============================================================================================//
// Create drug
export async function CreateDrug(
  UserId,
  BrandName,
  ScientificName = null,
  PurchaseDate = null,
  ExpirationDate = null,
  PurchasePrice = null,
  SellingPrice = null,
  Quantity = null,
  Location = null,
  Tags = null,
  Group = "Default"
) {
  try {
    const Drug = await Prisma.userMedicine.create({
      data: {
        UserId,
        BrandName,
        ScientificName,
        PurchaseDate: PurchaseDate ? new Date(PurchaseDate) : null,
        ExpirationDate: ExpirationDate ? new Date(ExpirationDate) : null,
        PurchasePrice,
        SellingPrice,
        Quantity,
        Location,
        Tags,
        Group,
      },
    });

    return Drug;
  } catch (err) {
    console.error("Error creating drug:", err);
    throw err;
  }
}
//============================================================================================//
// Retrieve all drugs
export async function RetrieveUserDrugs(UserId) {
    try {
        const Drugs = await Prisma.userMedicine.findMany({
            where: {UserId}
        })

        return Drugs
    } catch (err) {
        console.error("Error retrieving user drugs:", err)
        throw err
    }
}
//============================================================================================//
// Edit drug data
export async function UpdateDrugData(id, UserId, updates) {
    if (!updates || Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }
    try {
        const UpdatedDrug = await Prisma.userMedicine.update({
            where: { id_UserId: { id, UserId } },
            data: updates
        })

        return UpdatedDrug
    } catch (err) {
        console.error("Error updating drug data:", err)
        throw err
    }
}
//============================================================================================//
// Delete drug data
export async function DeleteDrugData(id, UserId) {
    try {
        const DeletedDrug = await Prisma.userMedicine.delete({
            where: { id_UserId: { id, UserId } },
        })

        return DeletedDrug
    } catch (err) {
        console.error("Error deleting drug data:", err)
        throw err
    }
}
//============================================================================================//
// Insert a drug by qr-code
export async function fetchGudeaDrugData(qrCode, UserID) {
  try {
    const res = await axios.post("https://gcs-admin.gudea.gov.iq/api/v1/scan-qr", { qr: qrCode });

    if (!res.data?.label) {
      return { success: false, error: "No label data returned from Gudea API." };
    }

    const label = res.data.label;
    const product = label.batch?.product || {};

    const BrandName = (label.short_name ? `${label.short_name} ${label.medical_form || ""}`.trim() : product.trading_name) || "Unknown Drug";
    const ScientificName = product.active_substances?.replace(/<[^>]*>/g, "") || null;
    const ExpirationDate = label.expiry_date || product.batch?.expire_date_date || null;
    const SellingPrice = product.price_matrix?.store_price || label.price_iqd || null;
    const Group = product.text_medical_form || "Default";

    const CreatedDrug = await CreateDrug(
      UserID,
      BrandName,
      ScientificName,
      null,
      ExpirationDate,
      null,
      SellingPrice,
      1,
      null,
      null,
      Group
    );

    return { success: true, drug: CreatedDrug };
  } catch (err) {
    console.error("❌ Error fetching Gudea data:", err?.response?.data || err.message || err);
    return { success: false, error: err?.response?.data?.message || err.message || "Unknown error" };
  }
}
//============================================================================================//