"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoadingCircle, SendIcon } from "../icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  const disabled = isLoading || !email || !password;

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
        <div className="flex flex-col space-y-4 p-7 sm:p-10">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-500">
            Enter your credentials to access your account.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-md border border-gray-200 bg-white px-5 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded-md border border-gray-200 bg-white px-5 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            className={clsx(
              "flex items-center justify-center rounded-md py-3 transition-all",
              disabled
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-gray-700 text-white hover:bg-gray-800",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <>
                Log in
                <SendIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
