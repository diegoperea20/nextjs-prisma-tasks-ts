import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Definimos la interfaz para el cuerpo de la solicitud
interface TaskRequest {
  useremail: string;
  title: string;
  description: string;
}

// Definimos la interfaz Task para que coincida exactamente con el modelo de Prisma
interface Task {
  id: number;
  useremail: string;
  title: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { useremail, title, description }: TaskRequest = await request.json();
    
    const newTask = await db.task.create({
      data: {
        useremail,
        title,
        description,
      },
    });
    
    return NextResponse.json(newTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al crear la tarea' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tasks: Task[] = await db.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener las tareas" },
      { status: 500 }
    );
  }
}