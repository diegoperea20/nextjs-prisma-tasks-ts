import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Interfaz para los parámetros de la ruta
interface RouteParams {
  params: {
    id: string;
    useremail: string;
  }
}

// Interfaz para el modelo Task
interface Task {
  id: number;
  useremail: string;
  title: string;
  description: string;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id, useremail } = params;

  try {
    const task: Task[] = await db.task.findMany({
      where: {
        id: parseInt(id),
        useremail: useremail,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener la tarea' },
      { status: 500 }
    );
  }
}