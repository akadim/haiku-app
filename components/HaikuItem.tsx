import { THaikuSchema } from "@/lib/types";
import { Haiku } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface HaikuProps {
  haiku: Haiku;
  key: number;
}

const HaikuItem: FC<HaikuProps> = ({ haiku, key }) => {
  return (
    <div>
      {haiku.line1} <br /> {haiku.line2} <br /> {haiku.line3} <br />{" "}
      <Link href={`/${haiku.id}/edit`}>Edit</Link>
      <hr />
    </div>
  );
};

export default HaikuItem;
