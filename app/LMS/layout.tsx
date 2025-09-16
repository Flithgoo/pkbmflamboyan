import UserInfroProvider from "@/app/components/LMS/UserInfoProvider";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return <UserInfroProvider>{children}</UserInfroProvider>;
};

export default Layout;
