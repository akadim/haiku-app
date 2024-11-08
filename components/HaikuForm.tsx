"use client";

import { HaikuSchema, THaikuSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Haiku } from "@prisma/client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface HaikuFormProps {
  type: string;
  haiku?: Haiku;
  onSubmit: SubmitHandler<THaikuSchema>;
}

interface CloudinaryResult {
  info?: {
    signature: string;
    public_id: string;
    version: string;
  };
}

const HaikuForm: FC<HaikuFormProps> = ({ type, haiku, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<THaikuSchema>({
    resolver: zodResolver(HaikuSchema),
    defaultValues: {
      line1: haiku?.line1 || "",
      line2: haiku?.line2 || "",
      line3: haiku?.line3 || "",
      photo: haiku?.photo || "",
    },
  });

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info) {
      setValue("photo", (result.info as CloudinaryUploadWidgetInfo).public_id);
      setValue(
        "version",
        "" + (result.info as CloudinaryUploadWidgetInfo).version
      );
      setValue(
        "signature",
        (result.info as CloudinaryUploadWidgetInfo).signature as string
      );
    }
  };

  return (
    <div>
      <p className="text-center text-2xl text-gray-600 mb-5"> {type} Haiku</p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            {...register("line1")}
            autoComplete="off"
            type="text"
            name="line1"
            placeholder="Line #1"
            defaultValue={haiku?.line1}
            className="input input-bordered w-full max-w-xs"
          />
          {errors.line1 && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errors.line1.message}</span>
            </div>
          )}
        </div>
        <div className="mb-3">
          <input
            {...register("line2")}
            autoComplete="off"
            type="text"
            name="line2"
            placeholder="Line #2"
            defaultValue={haiku?.line2}
            className="input input-bordered w-full max-w-xs"
          />
          {errors.line2 && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errors.line2.message}</span>
            </div>
          )}
        </div>
        <div className="mb-3">
          <input
            {...register("line3")}
            autoComplete="off"
            type="text"
            name="line3"
            placeholder="Line #3"
            defaultValue={haiku?.line3}
            className="input input-bordered w-full max-w-xs"
          />
          {errors.line3 && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errors.line3.message}</span>
            </div>
          )}
        </div>
        <CldUploadWidget
          signatureEndpoint="/api/widget-signature"
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            handleUploadSuccess(result);
          }}
          onQueuesEnd={(_, { widget }) => {
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <button
                className="btn btn-secondary mb-4"
                onClick={(evt) => {
                  evt.preventDefault();
                  open();
                }}
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>

        <button
          type="submit"
          className="btn btn-primary w-full max-w-xs"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default HaikuForm;
