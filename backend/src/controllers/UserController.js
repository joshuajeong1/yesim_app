import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const createUser = async (req, res) => {
    const { username, passwordHash, isAdmin, payRate } = req.body;
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
        console.error("Error creating user: ", error)
        res.status(500).json({ error: "Server error"});
    }
};

