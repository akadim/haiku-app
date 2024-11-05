import { createHaiku } from "@/actions/HaikuController";
import { ClientHaikuForm } from "@/components/ClientHaikuForm";
import { THaikuSchema } from "@/lib/types";
import React from "react";
import { SubmitHandler } from "react-hook-form";

const CreateHaikuPage = () => {
  const handleSubmit: SubmitHandler<THaikuSchema> = async (
    data: THaikuSchema
  ) => {
    await createHaiku(data);
  };
  return <ClientHaikuForm type="Create" />;
};

export default CreateHaikuPage;
