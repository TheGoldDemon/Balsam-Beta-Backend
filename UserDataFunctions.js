//============================================================================================//
// Libraries
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt"
//============================================================================================//
// Variables
const SaltRounds = 10
//============================================================================================//
// Init
const Prisma = new PrismaClient();
//============================================================================================//
// Create user
export async function CreateUser (FirstName, LastName, Email, Password, BirthDate, Gender, PhoneNumber) {
    try {
        const HashedPassword = await bcrypt.hash(Password, SaltRounds)
        const user = await Prisma.userLoginData.create({
            data: {
                FirstName,
                LastName,
                Email,
                Password: HashedPassword,
                BirthDate: new Date(BirthDate),
                Gender,
                PhoneNumber
            }
        })

        return user.id
    } catch (err) {
        console.error("Error creating user:", err) 
        throw err
    }
}
//============================================================================================//
// Retrieve user login data
export async function RetrieveUser (id) {
    try {
        const user = await Prisma.userLoginData.findUnique({where: {id}})

        if (!user) {
            console.log("No users found!")
            return null
        }

        return [user.FirstName, user.LastName, user.Email, user.Gender, user.BirthDate, user.AccountActivated]
    } catch (err) {
        console.error("Error retrieving user:", err)
        throw err
    }
}
//============================================================================================//
// Edit user data
export async function UpdateUser (id, updates) {
    try {
        if (updates.Email) delete updates.Email
        
        const updatedUser = await Prisma.userLoginData.update({
            where: {id},
            data: updates
        })

        return updatedUser;
    } catch (err) {
        console.error("Error updating user:", err)
        throw err
    }
}
//============================================================================================//
// Delete user data
export async function DeleteUser (id, inputPassword) {
  try {
    const user = await Prisma.userLoginData.findUnique({ where: { id } });
    if (!user) return console.log("No user found!");

    const passwordMatch = await bcrypt.compare(inputPassword, user.Password);
    if (!passwordMatch) {
      console.log("Password does not match. Cannot delete account.");
      return null;
    }

    await Prisma.userLoginData.delete({ where: { id } });
    console.log("User deleted successfully.");
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
}
//============================================================================================//
// Login user
export async function LoginUser (Email, Password) {
    try{
        const user = await Prisma.userLoginData.findUnique({
            where: {Email}
        })

        if (!user) {
            console.error("No such email found!")
            return null
        }

        const passwordMatch = await bcrypt.compare(Password, user.Password)

        if (!passwordMatch) {
            console.error("Password doesn't match!")
            return null
        }

        return user.id
    } catch (err) {
        console.error("Error logging in user:", err)
        throw err
    }
}
//============================================================================================//
// Auto-login user
export async function AutoLogin(idCookie) {
    try {
        console.log("AutoLogin received:", idCookie);

        if (!idCookie) {
            console.log("No cookie sent!");
            return null;
        }

        const user = await Prisma.userLoginData.findUnique({
            where: { id: idCookie }   // ← FIXED
        });

        if (!user) {
            console.log("No user found!");
            return null;
        }

        return user.id;

    } catch (err) {
        console.error("Error in auto-login:", err);
        throw err;
    }
}
//============================================================================================//