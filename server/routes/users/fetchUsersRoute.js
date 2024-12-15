import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/userModel.js';
import Role from '../../models/roleModel.js';

const router = express.Router();

// Fetch Roles
router.get('/api/roles', async (req, res) => {
    try{
        const roles = await Role.find(); 
        res.status(200).json(roles);
    }
    catch(error){
        console.error("Error fetching roles: "+error);
        res.status(500).json({error: "Internal server error while fetching roles"});
    }
});

// Fetch Users
router.get('/api/getUser', async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(error){
        console.error("Error fetching users data: "+error);
        res.status(500).json({error: "Internal server error while fetching users data"});
    }
});

// Fetch User by ID
router.get('/api/getUserById/:userId', async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    try {
        const users = await User.find({_id: userId});
        res.status(200).json(users);
    } 
    catch (error) {
        console.error("Error fetching user data: " + error);
        res.status(500).json({ error: "Internal server error while fetching user data" });
    }
});

export default router;
