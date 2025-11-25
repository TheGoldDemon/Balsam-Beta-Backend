//============================================================================================//
// Libraries
import { Agent, run } from '@openai/agents';
import 'dotenv/config';
import { z } from "zod";
import { tool } from "@openai/agents";
import { PrismaClient } from "@prisma/client";
//============================================================================================//
import { RetrieveUserDrugs } from './UserDrugFunctions.js';
import { RetrieveSummary } from './AIDataFunctions.js';
import { UpdateSummary } from './AIDataFunctions.js';
import { RetrieveSpecificChat } from './AIDataFunctions.js';
//============================================================================================//
// Setup
const Prisma = new PrismaClient();
//============================================================================================//
// AI tools

// Get all user drugs
export const RetrieveUserDrugsTool = tool({
  name: "RetrieveUserDrugsTool",
  description: "Fetches all stored medicines for a specific user from the database. Use when the user asks a question related to their medicine storage",
  parameters: z.object({
    UserId: z.string().describe("The unique ID of the user whose drugs to retrieve")
  }),
  execute: async ({ UserId }) => {
    const drugs = await RetrieveUserDrugs(UserId);
    return drugs;
  },
});

// Retrieve user summary
export const RetrieveSummaryTool = tool({
  name: "RetrieveSummaryTool",
  description: "Retrieves the user's long-term memory summary from the database. Use this to recall what the assistant already knows about the user.",
  parameters: z.object({
    UserId: z.string().describe("The unique ID of the user whose summary to retrieve."),
  }),
  execute: async ({ UserId }) => {
    const summary = await RetrieveSummary(UserId);
    return summary ?? "No memory summary found for this user.";
  },
});

// Update user summary
export const UpdateSummaryTool = tool({
  name: "UpdateSummaryTool",
  description: "Updates the user's long-term memory summary in the database. Use this to store newly learned or summarized information about the user.",
  parameters: z.object({
    UserId: z.string().describe("The unique ID of the user whose summary to update."),
    Summary: z.string().describe("The new summary text to store for the user."),
  }),
  execute: async ({ UserId, Summary }) => {
    const updated = await UpdateSummary(UserId, Summary);
    return updated;
  },
});

// Retrieve specific user chat
export const RetrieveSpecificChatTool = tool({
  name: "RetrieveSpecificChatTool",
  description: "Retrieves a specific chat by its unique Chat ID. Use this when the user requests to review or continue a particular conversation history.",
  parameters: {
    type: "object",
    properties: {
      ChatId: {
        type: "string",
        description: "The unique ID of the chat to retrieve."
      }
    },
    required: ["ChatId"]
  },
  execute: async ({ ChatId }) => {
    const chat = await RetrieveSpecificChat(ChatId);
    if (!chat) {
      return "No chat found with the given ID.";
    }
    return chat; // Return parsed JSON content directly for clarity
  },
});

// Create drug entry
export const CreateDrugTool = tool({
  name: "CreateDrugTool",
  description: "Adds a new drug to a user's pharmacy database.",
  parameters: z.object({
    UserId: z.number().describe("The ID of the user who owns the drug."),
    BrandName: z.string().describe("The brand name of the drug."),
    ScientificName: z.string().nullable().optional().describe("The scientific name of the drug, if available."),
    PurchaseDate: z.string().nullable().optional().describe("The date the drug was purchased (ISO format)."),
    ExpirationDate: z.string().nullable().optional().describe("The expiration date of the drug (ISO format)."),
    PurchasePrice: z.number().nullable().optional().describe("The price paid for the drug."),
    SellingPrice: z.number().nullable().optional().describe("The selling price of the drug, if applicable."),
    Quantity: z.number().nullable().optional().describe("The quantity of the drug available."),
    Location: z.string().nullable().optional().describe("Where the drug is stored."),
    Tags: z.string().nullable().optional().describe("Optional tags for categorizing the drug."),
    Group: z.string().default("Default").describe("Drug group name for organization.")
  }),

  execute: async ({
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
  }) => {
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
});

// Frontend base 64 image preparation
/*
function wrapBase64ForAgent(base64, UserId) {
  return {
    type: "image",
    UserId, // include the user ID here
    content: base64,
    note: "This is an image for the AI to analyze. Extract drug data from it to import into the user's database using your CreateDrugTool. It can be either an image of a single drug (run CreateDrugTool once) or an image of multiple drugs/list (run CreateDrugTool multiple times to extract each drug cleanly)."
  };
}
  */

// Then just call the MessageRequest function from the frontend (by fetching your Express route)
// And pass the returned data from the wrap function into it. Beautifully done!
//============================================================================================//
//============================================================================================//