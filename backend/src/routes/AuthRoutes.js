import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
require("dotenv").config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if(!user) {
        return res.status(401).json({ error: "User does not exist!" })
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if(!valid) {
        return res.status(401).json({ error: "Incorrect password" })
    }

    const token = jwt.sign(
        {
            userId: user.id, isAdmin: user.isAdmin
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token })
});
