import dbConnect from "@/lib/db/connect";
import { Task } from "@/lib/db/models/Task";
import { getUser } from "@/lib/helpers/getUser";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const userId = getUser(request.headers);
    const { id } = await params;

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const userId = getUser(request.headers);
    const { id } = await params;
    const { value, status } = await request.json();

    const payload = {};

    if (typeof value === "string" && value.trim()) {
      payload.value = value.trim();
    }

    if (status === "PENDING" || status === "COMPLETED") {
      payload.status = status;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      payload,
      {
        returnDocument: "after",
      },
    );

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(_request, { params }) {
  try {
    await dbConnect();
    const userId = getUser(_request.headers);
    const { id } = await params;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { status: "COMPLETED" },
      {
        returnDocument: "after",
      },
    );

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
