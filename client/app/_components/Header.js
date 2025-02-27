"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CLIENT_URL } from "../_lib/utils";
import { useCurrentUser } from "./UserContext";

function Header() {
  const [loggedInData, setLoggedInData] = useState(null);
  const { currentUser, setCurrentUser } = useCurrentUser();

  async function handleLogout() {
    const res = await fetch(`${CLIENT_URL}/api/logout`);
    const data = await res.json();
    if (data.status === "success") {
      location.reload(true); //CHANGED
    }
  }

  useEffect(
    function () {
      async function getMe() {
        const response = await fetch(`${CLIENT_URL}/api/login`);
        const data = await response.json();

        if (data.isLoggedIn === false) {
          setLoggedInData(null);
          setCurrentUser(null);
        } else {
          setLoggedInData(data);
          setCurrentUser({
            ...data.user.data.data,
            jwt: data.jwt.value,
          });
        }
      }
      getMe();
    },
    [setCurrentUser]
  );

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link href="/" className="nav__el">
          All tours
        </Link>
        <form className="nav__search">
          <button className="nav__search-btn">
            <Search />
          </button>
          <input
            type="text"
            placeholder="Search tours"
            className="nav__search-input"
          />
        </form>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {loggedInData?.isLoggedIn ? (
          <>
            <Link href="my-tours" className="nav__el">
              My tours
            </Link>
            <button onClick={handleLogout} className="nav__el">
              Log out
            </button>
            <Link href="/me" className="nav__el">
              <img
                src={
                  currentUser?.photo
                    ? `/img/users/${currentUser.photo}`
                    : "/img/users/default.jpg"
                }
                alt="User photo"
                className="nav__user-img"
              />
              <span>{currentUser?.name.split(" ")[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="nav__el">
              Log in
            </Link>
            <Link href="/signup" className="nav__el nav__el--cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
