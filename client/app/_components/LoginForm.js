"use client";

import { useState } from "react";
import { SERVER_URL } from "../_lib/utils";
import { useCurrentUser } from "./UserContext";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

//PROBLEM WITH SERVER ACTIONS => CANNOT SEND COOKIES
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  //HACK - place this check here instead of server comp
  const { currentUser } = useCurrentUser();
  if (currentUser) redirect("/");

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${SERVER_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "fail") {
        toast.error(data.message);
        return;
      }
      toast.success("Logged in!");
      location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="form">
      <div className="form__group">
        <label htmlFor="email" className="form__label">
          Email address
        </label>
        <input
          id="email"
          name="email"
          className="form__input"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="form__group">
        <label htmlFor="password" className="form__label">
          Password
        </label>
        <input
          id="password"
          name="password"
          className="form__input"
          placeholder="••••••••"
          required
          minLength="8"
          type="password"
        />
      </div>
      <div className="form__group">
        <button className="btn btn--green" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
