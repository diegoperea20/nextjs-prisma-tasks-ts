import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link  from "next/link";
import { buttonVariants } from "@/components/ui/button";

const page =async () => {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        return (<div><h2 className="text-4xl text-center">Welcome to Admin {session?.user.username || session.user.name}</h2> <Link className={buttonVariants()} href="/task">Open Task</Link></div>)

    }
    return <h2 className="text-2xl text-center ">Please login  to see this admin page</h2>
};
export default page;