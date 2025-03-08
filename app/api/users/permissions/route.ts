import { getUserById } from "@/services/userService";
import dbConnect from "@/utils/dbConnect";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const user = await getUserById(cookies().get("token").value);
        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}