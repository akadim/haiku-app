import { getHaikus } from "@/actions/HaikuController";
import { Haiku } from "@prisma/client";
import { FC } from "react";
import HaikuItem from "./HaikuItem";

interface DashboardProps {
  haikus: Haiku[];
}

const Dashboard: FC<DashboardProps> = async () => {
  const haikus = await getHaikus();

  return (
    <div>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Your Haikus</h2>
      {haikus?.map((haiku, index) => (
        <HaikuItem haiku={haiku} key={index} />
      ))}
    </div>
  );
};

export default Dashboard;
