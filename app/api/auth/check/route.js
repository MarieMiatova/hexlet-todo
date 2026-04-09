import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const login = searchParams.get("login");

    const existingUsers = await User.countDocuments({ login });

    return NextResponse.json({
      success: existingUsers > 0,
      message: "User with this login exists",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "User with this login not found" },
      { status: 404 },
    );
  }
}
