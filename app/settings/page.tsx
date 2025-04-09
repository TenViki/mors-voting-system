import { validateAdmin } from "@/actions/admin";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import VoteSettings from "./VoteSettings";

const page = async () => {
  const c = await cookies();
  const jwt = c.get("admin_jwt");

  const isAdmin = await validateAdmin(false);

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="py-4 px-8">
      <VoteSettings />
    </div>
  );
};

export default page;
