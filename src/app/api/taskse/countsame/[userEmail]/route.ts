import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Interfaces
interface RouteParams {
  params: { userEmail: string; };
}

interface QueryResult {
  title: string;
  shared_emails: string;
}

interface ProcessedResult {
  title: string;
  emails: string[];
}

interface ErrorResponse {
  message: string;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProcessedResult[] | ErrorResponse>> {
  const { userEmail } = params;

  try {
    // Primero verificamos si el usuario tiene tareas
    const userTasks = await db.task.findMany({
      where: {
        useremail: userEmail
      },
      select: {
        title: true
      }
    });

    if (userTasks.length === 0) {
      return NextResponse.json<ErrorResponse>({
        message: 'No tasks found for this user.'
      });
    }

    // Obtenemos los títulos de las tareas del usuario
    const userTaskTitles = userTasks.map(task => task.title);

    // Buscamos tareas con títulos coincidentes de otros usuarios
    const matchingTasks = await db.task.groupBy({
      by: ['title'],
      where: {
        AND: [
          { title: { in: userTaskTitles } },
          { useremail: { not: userEmail } }
        ]
      },
      _count: {
        title: true
      }
    });

    if (matchingTasks.length === 0) {
      return NextResponse.json<ErrorResponse>({
        message: 'No matches were found with other users.'
      });
    }

    // Para cada título coincidente, obtenemos los emails válidos
    const results: ProcessedResult[] = await Promise.all(
      matchingTasks.map(async (match) => {
        // Obtener los userEmails de las tareas coincidentes
        const taskUsers = await db.task.findMany({
          where: {
            AND: [
              { title: match.title },
              { useremail: { not: userEmail } }
            ]
          },
          select: {
            useremail: true
          }
        });

        // Buscar los emails completos en la tabla User que coincidan con los userEmails
        const validEmails = await Promise.all(
          taskUsers.map(async (taskUser) => {
            const user = await db.user.findFirst({
              where: {
                email: {
                  startsWith: taskUser.useremail + '@'
                }
              },
              select: {
                email: true
              }
            });
            return user?.email;
          })
        );

        // Filtrar null/undefined y eliminar duplicados de manera más compatible
        const filteredEmails = Array.from(
          new Set(
            validEmails.filter((email): email is string => 
              email !== null && email !== undefined
            )
          )
        );

        return {
          title: match.title,
          emails: filteredEmails
        };
      })
    );

    // Filtrar resultados que no tienen emails válidos
    const finalResults = results.filter(result => result.emails.length > 0);

    if (finalResults.length === 0) {
      return NextResponse.json<ErrorResponse>({
        message: 'No matches were found with valid emails.'
      });
    }

    return NextResponse.json(finalResults);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json<ErrorResponse>(
      { message: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}