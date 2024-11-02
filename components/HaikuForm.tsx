import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const HaikuForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler = (data) => {};
  return (
    <div>
      <p className="text-center text-2xl text-gray-600 mb-5">Create Haiku</p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            {...register("line1")}
            autoComplete="off"
            type="text"
            name="line1"
            placeholder="Line 1"
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
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
          />
          {errors.username && (
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
              <span>{errors.username.message}</span>
            </div>
          )}
        </div>
        <div className="mb-3">
          <input
            {...register("username")}
            autoComplete="off"
            type="text"
            name="username"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
          />
          {errors.username && (
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
              <span>{errors.username.message}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full max-w-xs"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default HaikuForm;
