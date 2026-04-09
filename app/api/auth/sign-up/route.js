import { User } from "@/lib/db/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/connect";

export async function POST(request) {
  await dbConnect();

  const { login, password } = await request.json();

  const isUserExisting = await User.findOne({ login });

  if (isUserExisting)
    return NextResponse.json(
      { message: "User with this login already existing" },
      { status: 400 },
    );

  const passwordSalt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, passwordSalt);

  const user = await User.create({ login, password: passwordHash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return NextResponse.json({ user, token });
}
