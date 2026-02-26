import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true
     },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true, 
        minlength: 6 
    },
    role: {
       type: String,
       enum: ["user", "admin"],
       default: "user"
    },
    watchlist: [
      {
        symbol: String,
        addedAt: {
             type: Date,
             default: Date.now 
            }
      }
    ],
    balance: {
      type: Number,
      default: 10000
    },
    portfolio: [
      {
        symbol: String,
        quantity: Number
      }
    ],
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true 
}
);
export default mongoose.model("User", userSchema);
