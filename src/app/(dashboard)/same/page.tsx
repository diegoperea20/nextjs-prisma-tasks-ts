import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SamePage from "@/components/SamePage";

const SamePageServer = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email?.split('@')[0] || '';

  return <SamePage initialUserEmail={userEmail} />;
};

export default SamePageServer;