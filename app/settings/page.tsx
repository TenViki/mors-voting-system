import { validateAdmin } from "@/actions/admin";
import { Box } from "@mantine/core";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import SettingsPage from "./SettingsPage";

const page = async () => {
  const c = await cookies();
  const jwt = c.get("admin_jwt");

  const isAdmin = await validateAdmin(false);

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <Box
      className="py-4 px-8"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SettingsPage />
    </Box>
  );
};

export default page;
