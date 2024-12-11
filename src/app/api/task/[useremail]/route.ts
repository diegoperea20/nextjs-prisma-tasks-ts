import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Interfaz para los parámetros de la ruta
interface RouteParams {
  params: {
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
  const { useremail } = params;

  try {
    const tasks: Task[] = await db.task.findMany({
      where: { useremail: useremail },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener las tareas' },
      { status: 500 }
    );
  }
}