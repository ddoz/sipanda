import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare, compareSync, hash } from "bcrypt";

export async function POST(req: Request, res: Response) {
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

    if (user && (await compare(password, user.password))) {
      console.log(user);
      return NextResponse.json(user, { status: 200 });
    } else {
      return null;
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { status: "fail", error: e.message },
      { status: 500 },
    );
  }
}
