const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: Malformed token' });
            return;
        }

        const secret = process.env.JWT_SECRET;

        const decoded = jwt.verify(token, secret);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userid }
        });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid user' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = auth;
