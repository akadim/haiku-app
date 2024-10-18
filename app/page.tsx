import { FC } from "react";

const Home: FC = () => {
  return (
    <>
      <p className="text-center text-2xl text-gray-600 mb-5">
        Don&rsquo;t have an account yet, <strong>Create One</strong>
        <form action="." className="max-w-xs mx-auto">
          <div className="mb-3">
            <input
              autoComplete="off"
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="mb-3">
            <input
              autoComplete="off"
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <button className="btn btn-primary w-full max-w-xs">
            Create Account
          </button>
        </form>
      </p>
    </>
  );
};

export default Home;
