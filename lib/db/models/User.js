import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [{ type: String, ref: "task" }],
});

export const User = models.User || model("User", userSchema);
