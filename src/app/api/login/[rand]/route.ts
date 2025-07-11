import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const user = await prisma.user.findFirst({
      where: {
        email: username,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "Username atau Password Salah" },
        { status: 401 },
      );
    }

    const passwordMatch = await compare(password, user.password);
    if (passwordMatch) {
      // Optional: hapus password dari response biar lebih aman
      const { password, ...safeUser } = user;
      return NextResponse.json(safeUser, { status: 200 });
    } else {
      return NextResponse.json(
        { status: "Username atau Password Salah" },
        { status: 401 },
      );
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
