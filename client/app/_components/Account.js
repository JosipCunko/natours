"use client";

import { redirect } from "next/navigation";
import { useCurrentUser } from "./UserContext";
import {
  updateCurrentUserData,
  updateCurrentUserPassword,
  updateCurrentUserPhoto,
} from "../_lib/actions.js";
import toast from "react-hot-toast";
import { useState } from "react";

function Account() {
  const { currentUser } = useCurrentUser();
  if (!currentUser) redirect("/");

  const [isLoading, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  async function handleSubmitPhoto(e) {
    e.preventDefault();
    if (!photo) {
      toast.error("Please select a photo");
      return;
    }
    setIsLoading1(true);

    const res = await updateCurrentUserPhoto({
      photo,
      jwt: currentUser.jwt,
    });
    setIsLoading1(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Updating profile photo was successfull");
    location.reload();
  }

  async function handleSubmitAccountInfo(e) {
    e.preventDefault();
    setIsLoading2(true);

    const res = await updateCurrentUserData({
      email,
      name,
      jwt: currentUser.jwt,
      id: currentUser._id,
    });
    setIsLoading2(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Updating data was successfull");
    location.reload();
  }
  async function handleSubmitPassword(e) {
    e.preventDefault();
    setIsLoading3(true);

    const res = await updateCurrentUserPassword({
      currentPassword,
      newPassword,
      confirmPassword,
      jwt: currentUser.jwt,
      id: currentUser._id,
    });
    setIsLoading3(false);
    if (res.error) return toast.error(res.error.message);
    setNewPassword("");
    setCurrentPassword("");
    setConfirmPassword("");
    toast.success("Updating password was successfull");
    location.reload();
  }

  return (
    <div className="user-view__content">
      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
        <form
          className="form form-user-data"
          onSubmit={handleSubmitAccountInfo}
        >
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="form__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form__group right">
            <button className="btn btn--small btn--green" disabled={isLoading2}>
              {isLoading2 ? "Updating..." : "Update settings"}
            </button>
          </div>
        </form>
        <form className="form form-user-data" onSubmit={handleSubmitPhoto}>
          <div className="form__group form__photo-upload">
            <img
              className="form__user-photo"
              src={
                currentUser.photo
                  ? `/img/users/${currentUser.photo}`
                  : "/img/users/default.jpg"
              }
              alt="User photo"
            />
            <input
              type="file"
              accept="image/*"
              className="form__upload"
              onChange={(e) => setPhoto(e.target.files?.[0])}
              id="photo"
            />
            <label htmlFor="photo">Create new photo</label>
          </div>

          <div className="form__group right">
            <button className="btn btn--small btn--green" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update photo"}
            </button>
          </div>
        </form>
      </div>

      <div className="line">&nbsp;</div>

      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Password change</h2>
        <form
          className="form form-user-settings"
          onSubmit={handleSubmitPassword}
        >
          <div className="form__group">
            <label className="form__label" htmlFor="password-current">
              Current password
            </label>
            <input
              id="password-current"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form__group ma-bt-lg">
            <label className="form__label" htmlFor="password-confirm">
              Confirm password
            </label>
            <input
              id="password-confirm"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form__group right">
            <button className="btn btn--small btn--green" disabled={isLoading3}>
              {isLoading3 ? "Updating..." : "Save password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;
