import { loginUser } from "@/services/userService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    const token = await loginUser(email, password);

    if (token) {
      // Configura o cookie com o token
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      );

      response.cookies.set("token", token, {
        /* httpOnly: true,
        secure: process.env.NODE_ENV === "production", */
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}