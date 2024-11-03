import { FC } from "react";
import getUserFromCookie from "@/lib/getUser";

import Signup from "@/components/Signup";
import Dashboard from "@/components/Dashboard";

const Home: FC = async () => {
  const user = await getUserFromCookie();
  return (
    <>
      {user && <Dashboard />}
      {!user && <Signup />}
    </>
  );
};

export default Home;
