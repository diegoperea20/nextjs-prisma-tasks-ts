import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Interfaces
interface RouteParams {
  params: {
    userEmail: string;
  };
}

interface TaskCount {
  count: number;
  title: string;
}

interface ErrorResponse {
  message: string;
}

// Route handler
export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse<TaskCount[] | ErrorResponse>> {
  const { userEmail } = params;

  try {
    // First, find all titles from the current user
    const userTitles = await db.task.findMany({
      where: {
        useremail: userEmail
      },
      select: {
        title: true
      }
    });

    // Get array of just the titles
    const titles = userTitles.map(t => t.title);

    if (titles.length === 0) {
      return NextResponse.json<ErrorResponse>({
        message: 'This user has no tasks.'
      });
    }

    // Find tasks with same titles from other users
    const duplicateTasks = await db.task.groupBy({
      by: ['title'],
      where: {
        AND: [
          {
            title: {
              in: titles
            }
          },
          {
            OR: [
              { useremail: userEmail },
              {
                useremail: {
                  not: userEmail
                }
              }
            ]
          }
        ]
      },
      _count: {
        title: true
      },
      having: {
        title: {
          _count: {
            gt: 1
          }
        }
      }
    });

    if (duplicateTasks.length === 0) {
      return NextResponse.json<ErrorResponse>({
        message: 'No title matches other users.'
      });
    }

    // Format the response
    const result = duplicateTasks.map((task) => ({
      count: task._count.title,
      title: task.title
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json<ErrorResponse>(
      { message: 'There was an error processing the request.' },
      { status: 500 }
    );
  }
}