import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        user: {
            type: Array
        }
    }
)

export const Admin = mongoose.model("Admin", admin) 