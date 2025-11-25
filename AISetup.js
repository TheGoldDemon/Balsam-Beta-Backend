import { Agent, run } from '@openai/agents';
import 'dotenv/config';

import { RetrieveUserDrugsTool, RetrieveSummaryTool, UpdateSummaryTool, CreateDrugTool } from './AIAutoFunctions.js';

export const PharmacyAssistant = new Agent({
  name: 'PharmacyAssistant',
  model: 'gpt-4.1',
  instructions: "You are a helpful pharmacy assistant built into a web app that helps people manage their medicine storage. You are able to retrieve all of the user's medicine using the RetrieveUserDrugsTool, edit it, and give statistical analysis on it. You also provide helpful information whenever possible. Your name is Balsam. When given information that is useful to store about a user use the RetrieveSummaryTool provided to get the summerized user info then use the UpdateSummaryTool provided to send the new summerized data back to the server. The messages that are sent to you to answer are in the given format: {UserId: *ID*, ChatID: *ID*, MessageContent: *Text*}. if a drug's cost is not provided in the drug creation request set it to zero yourself.",
  tools: [RetrieveUserDrugsTool, RetrieveSummaryTool, UpdateSummaryTool, CreateDrugTool]
});

//============================================================================================//
// Chat function
export async function MessageRequest(UserMessage) {
  try {
    const result = await run(PharmacyAssistant, UserMessage);
    return {
      user: UserMessage,
      assistant: result.finalOutput,
    };
  } catch (err) {
    console.error("Error in MessageRequest:", err);
    throw err;
  }
}
//============================================================================================//