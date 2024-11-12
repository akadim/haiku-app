import { getCachedHaiku, updateHaiku } from "@/actions/HaikuController";
import { ClientHaikuForm } from "@/components/ClientHaikuForm";
import HaikuForm from "@/components/HaikuForm";
import { THaikuSchema } from "@/lib/types";
import { FC } from "react";
import { SubmitHandler } from "react-hook-form";

interface EditHaikuPageProps {
  params: {
    haikuId: string;
  };
}

const EditHaikuPage: FC<EditHaikuPageProps> = async (
  props: {
    params: Promise<{ haikuId: string }>;
  }
) => {
  const params = await props.params;
  const haiku = await getCachedHaiku(params.haikuId);

  return (
    <ClientHaikuForm type="Edit" haiku={haiku!} haikuId={params.haikuId} />
  );
};

export default EditHaikuPage;
