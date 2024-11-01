import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const getUserFromCookie = async () => {
  const theCookie = cookies().get("ourHaikuApp")?.value;
  if (theCookie) {
    try {
      const decoded = jwt.verify(theCookie, process.env.JWT_SECRET!);
      return decoded;
    } catch (err) {
      return null;
    }
  }
};

export default getUserFromCookie;
