import mongoose from "mongoose";
import './config.js';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
    password: { type: String, },
    confirmPassword: { type: String, },    
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    hashedPassword: { type: String, required: true, unique: true },
    profileImage: [{
        imageName: { type: String },
        imagePath: { type: String }
    }],
    // roles: [{ type: mongoose.Schema.Types., ref: 'Role' }], // For _id of Roles
    role: { type: String, default: 'Client' },
    dateOfCreation: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
