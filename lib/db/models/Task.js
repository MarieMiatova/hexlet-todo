import { model, models, Schema } from "mongoose";

const taskSchema = new Schema({
  value: { type: String, required: true },
  status: { type: String, default: "PENDING" },
  user: { type: String, ref: "user" },
});

export const Task = models.Task || model("Task", taskSchema);
