import UserInfroProvider from "@/app/components/LMS/UserInfoProvider";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <UserInfroProvider>
      <div className=" bg-gradient-to-br py-5 from-emerald-50 to-amber-50">
        {children}
      </div>
    </UserInfroProvider>
  );
};

export default Layout;
