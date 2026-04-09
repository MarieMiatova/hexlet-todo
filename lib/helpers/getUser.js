import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function getUser(headers) {
  const authHeader = headers.get("authorization");
  if (!authHeader) throw new Error();

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error();

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (!verified) throw new Error();

  return verified.id;
}
