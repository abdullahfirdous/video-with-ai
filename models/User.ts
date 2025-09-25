import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  displayName?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true
    },
    password: { type: String, required: true },
    displayName: { type: String, default: "" },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiry: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
userSchema.index({ resetPasswordToken: 1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;