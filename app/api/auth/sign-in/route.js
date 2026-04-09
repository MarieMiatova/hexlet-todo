import { User } from "@/lib/db/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";

export async function POST(request) {
  await dbConnect();
  const { login, password } = await request.json();

  const user = await User.findOne({ login });

  if (!user)
    return NextResponse.json(
      { message: "Wrong login or password" },
      { status: 401 },
    );

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare)
    return NextResponse.json(
      { message: "Wrong login or password" },
      { status: 401 },
    );

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return NextResponse.json({ user, token });
}
