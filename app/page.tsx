import { FC } from "react";
import getUserFromCookie from "@/lib/getUser";

import Signup from "@/components/Signup";

const Home: FC = async () => {
  const user = await getUserFromCookie();
  return (
    <>
      {user && <p>Welcome, you are logged in.</p>}
      {!user && <Signup />}
    </>
  );
};

export default Home;
