import dbConnect from "@/lib/db/connect";
import { Task } from "@/lib/db/models/Task";
import { getUser } from "@/lib/helpers/getUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const userId = getUser(request.headers);
    const data = await Task.find({ user: userId });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const userId = getUser(request.headers);
    const { value } = await request.json();

    if (!value?.trim()) {
      return NextResponse.json(
        { message: "Task value is required" },
        { status: 400 },
      );
    }

    const task = await Task.create({
      value: value.trim(),
      status: "PENDING",
      user: userId,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
