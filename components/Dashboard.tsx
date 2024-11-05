import { getAuthToken, getCachedHaikies } from "@/actions/HaikuController";
import { FC } from "react";
import HaikuItem from "./HaikuItem";

const Dashboard: FC = async () => {
  const token = await getAuthToken();
  const haikus = await getCachedHaikies(token);

  return (
    <div>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Your Haikus</h2>
      {haikus
        ?.sort((a, b) => (a.id < b.id ? 1 : -1))
        .map((haiku, index) => (
          <HaikuItem haiku={haiku} key={index} />
        ))}
    </div>
  );
};

export default Dashboard;
