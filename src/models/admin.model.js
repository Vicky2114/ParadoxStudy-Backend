const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Array,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
