import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Interfaz para los parámetros de la ruta
interface RouteParams {
  params: {
    id: string;
  }
}

// Interfaz para el cuerpo de la solicitud de actualización
interface UpdateTaskRequest {
  useremail: string;
  title: string;
  description: string;
}

// Interfaz para el modelo Task
interface Task {
  id: number;
  useremail: string;
  title: string;
  description: string;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  const { useremail, title, description }: UpdateTaskRequest = await request.json();

  try {
    const updatedTask = await db.task.update({
      where: { id: parseInt(id) },
      data: {
        useremail,
        title,
        description,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al actualizar la tarea' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;

  try {
    const deletedTask = await db.task.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al eliminar la tarea' },
      { status: 500 }
    );
  }
}