"use client";

import { FC } from "react";
import HaikuForm from "./HaikuForm";
import { SubmitHandler } from "react-hook-form";
import { THaikuSchema } from "@/lib/types";
import { Haiku } from "@prisma/client";
import { createHaiku, updateHaiku } from "@/actions/HaikuController";

interface ClientHaikuFormProps {
  type: "Create" | "Edit";
  haiku?: Haiku;
  haikuId?: string;
}

export const ClientHaikuForm: FC<ClientHaikuFormProps> = ({
  type,
  haiku,
  haikuId,
}) => {
  const handleSubmit: SubmitHandler<THaikuSchema> = async (
    data: THaikuSchema
  ) => {
    if (type === "Edit") {
      await updateHaiku(haikuId!, data);
    } else {
      await createHaiku(data);
    }
  };

  return <HaikuForm type={type} haiku={haiku} onSubmit={handleSubmit} />;
};
