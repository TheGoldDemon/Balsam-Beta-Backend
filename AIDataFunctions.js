//============================================================================================//
// Libraries
import { PrismaClient } from '@prisma/client';
//============================================================================================//
// Variables
//============================================================================================//
// Init
const Prisma = new PrismaClient();
//============================================================================================//
// Create Summary
export async function CreateSummary(UserId, Summary) {
    try {
        const CreatedSummary = await Prisma.userMemory.create({
            data: {
                UserId,
                Summary
            }
        })

        return CreatedSummary
    } catch (err) {
        console.error("Error creating summary:", err)
        throw err
    }
}
//============================================================================================//
// Retrieve Summary
export async function RetrieveSummary(UserId) {
    try {
        const RetrievedSummary = await Prisma.userMemory.findUnique({
            where: {UserId}
        })

        return RetrievedSummary
    } catch (err) {
        console.error("Error retrieving summary:", err)
        throw err
    }
}
//============================================================================================//
// Edit Summary
export async function UpdateSummary(UserId, Summary) {
    try {
        const UpdatedSummary = await Prisma.userMemory.update({
            where: {UserId},
            date: {Summary}
        })

        return UpdatedSummary
    } catch (err) {
        console.error("Error updating summary:", err)
        throw err
    }
}
//============================================================================================//
// Create Chat
export async function CreateChat(UserId, Content) {
  try {
    const Chat = await Prisma.userChat.create({
      data: { UserId, Content: JSON.stringify(Content) }
    });
    return Chat;
  } catch (err) {
    console.error("Error creating chat:", err);
    throw err;
  }
}
//============================================================================================//
// Retrieve all user chats
export async function RetrieveUserChats(UserId) {
  const chats = await Prisma.userChat.findMany({
    where: { UserId },
    orderBy: { CreatedAt: 'asc' }
  });

  return chats.map(chat => ({ ...chat, Content: JSON.parse(chat.Content) }));
}
//============================================================================================//
// Append to chat
export async function AppendToChat(chatId, newMessages) {
  const chat = await Prisma.userChat.findUnique({ where: { id: chatId } });
  if (!chat) throw new Error("Chat not found");

  const currentContent = JSON.parse(chat.Content);
  const updatedContent = [...currentContent, ...newMessages];

  const updatedChat = await Prisma.userChat.update({
    where: { id: chatId },
    data: { Content: JSON.stringify(updatedContent) }
  });

  return updatedChat;
}
//============================================================================================//
// Delete user chat
export async function DeleteUserChat(chatId) {
    try {
        const deletedChat = await Prisma.userChat.delete({
            where: { id: chatId }
        });

        return deletedChat;
    } catch (err) {
        console.error("Error deleting user chat:", err);
        throw err;
    }
}
//============================================================================================//
// Retrieve specific user chat
export async function RetrieveSpecificChat(chatId) {
    try {
        const chat = await Prisma.userChat.findUnique({
            where: { id: chatId }
        });

        if (!chat) return null;

        return { ...chat, Content: JSON.parse(chat.Content) };
    } catch (err) {
        console.error("Error retrieving specific user chat:", err);
        throw err;
    }
}
//============================================================================================//