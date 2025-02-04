import mongoose from "mongoose";
import './config.js';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true}
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
