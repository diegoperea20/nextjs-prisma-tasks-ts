import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import TaskPage from "@/components/TaskPage";

const TaskPageServer = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email?.split('@')[0] || '';

  return <TaskPage initialUserEmail={userEmail} />;
};

export default TaskPageServer;