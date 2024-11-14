"use client";

import { deleteHaiku } from "@/actions/HaikuController";
import { Haiku } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { FC, useState } from "react";
import DeleteButton from "./DeleteButton";

interface HaikuProps {
  haiku: Haiku;
  key: number;
}

const HaikuItem: FC<HaikuProps> = ({ haiku, key }) => {
  if (!haiku.photo || haiku.photo === "") {
    haiku.photo = "fallback";
  }

  return (
    <div className="relative rounded-xl overflow-hidden max-w-[650px] h-[300px] mx-auto mb-7">
      <img src="/aspect-ratio.png" />
      <div className="absolute inset-0 bg-gray-200 grid">
        <span className="loading loading-dots loading-lg m-auto"></span>
      </div>

      <CldImage
        className="absolute inset-0"
        key={key}
        width="650"
        height="300"
        src={haiku.photo}
        sizes="650px"
        alt={haiku.photo}
        crop={{ type: "pad", source: true }}
        fillBackground
        overlays={[
          {
            position: { x: 34, y: 154, angle: -10, gravity: "north_west" },
            text: {
              color: "black",
              fontSize: 42,
              fontWeight: "bold",
              fontFamily: "Source Sans Pro",
              text: `${haiku.line1}%0A${haiku.line2}%0A${haiku.line3}`,
            },
          },
          {
            position: { x: 30, y: 150, angle: -10, gravity: "north_west" },
            text: {
              color: "white",
              fontSize: 42,
              fontWeight: "bold",
              fontFamily: "Source Sans Pro",
              text: `${haiku.line1}%0A${haiku.line2}%0A${haiku.line3}`,
            },
          },
          {},
        ]}
      />
      <div className="absolute bottom-2 right-2 flex">
        <Link
          className="inline-block mr-1 bg-black/40 hover:bg-black/50 p-1 text-white/60 hover:text-white/80 rounded"
          href={`/${haiku.id}/edit`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <DeleteButton onDelete={() => deleteHaiku(haiku.id)} />
      </div>
    </div>
  );
};

export default HaikuItem;
