import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

export const updatePay = async (req, res) => {
    const { userId, newPay } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                payRate: Number(newPay),
            },
        });
        res.status(201).json(updatedUser)
    }
    catch (error) {
        console.log("Internal server error");
        res.status(500).json({error: error})
    }
}

export const deleteUser = async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const deletedUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        if(!deletedUser) {
            console.log("User not found!");
            throw "User not found";
        }

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        console.log("User deleted: ", deletedUser);
        res.status(201).json(deletedUser);
    }
    catch (error) {
        res.status(500).json( { error: "Internal sever error" })
    }
}

export const createUser = async (req, res) => {
    const { username, password, isAdmin, payRate } = req.body;
    let passwordHash = password;
    if(password === "") {
        passwordHash = await bcrypt.hash("userPassword", 10)
    }
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                passwordHash,
                isAdmin,
                payRate,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Server error"});
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                isAdmin: false,
            },
            select: {
                id: true,
                username: true,
            },
            orderBy: {
                id: 'asc'
            }
        });
        res.json({ users: users})
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getUsersFull = async(req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                isAdmin: false,
            },
            select: {
                id: true,
                username: true,
                payRate: true,
            },
            orderBy: {
                id: 'asc'
            }
        });
        res.json({users: users })
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}
