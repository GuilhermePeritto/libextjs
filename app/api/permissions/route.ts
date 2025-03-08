import {
    createPermissionGroup,
    getPermissionGroups
} from "@/services/permissionService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
  
  // Buscar todos os grupos de permissões
  export async function GET() {
    await dbConnect();
  
    try {
      const groups = await getPermissionGroups();
      return NextResponse.json(groups, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  // Criar um novo grupo de permissões
  export async function POST(request: Request) {
    await dbConnect();
  
    try {
      const groupData = await request.json();
      const group = await createPermissionGroup(groupData);
      return NextResponse.json(group, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
