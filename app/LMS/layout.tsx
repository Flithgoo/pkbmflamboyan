import UserInfoProvider from "@/app/components/LMS/UserInfoProvider";
import { Toaster } from "@/components/ui/sonner";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <UserInfoProvider>
      <div className=" bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </UserInfoProvider>
  );
};

export default Layout;
