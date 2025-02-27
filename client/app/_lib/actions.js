"use server";

import { SERVER_URL } from "./utils";

export async function updateCurrentUserData({ email, name, jwt, id }) {
  try {
    const res = await fetch(`${SERVER_URL}/users/updateme`, {
      method: "PATCH",
      user: { id },

      body: JSON.stringify({ email, name }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await res.json();
    if (data.status === "success") return true;
    else throw new Error("Something went very wrong");
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function updateCurrentUserPassword({
  currentPassword,
  newPassword,
  confirmPassword,
  jwt,
  id,
}) {
  try {
    const res = await fetch(`${SERVER_URL}/users/updatemypassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      }),
      user: { id },
    });
    const data = await res.json();
    if (data.status === "success") return true;
    else throw new Error("Something went very wrong");
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function updateCurrentUserPhoto({ photo, jwt }) {
  try {
    if (!photo) throw new Error("Please select a file!");

    const dataToSend = new FormData();
    dataToSend.append("photo", photo);

    const res = await fetch(`${SERVER_URL}/users/updateme`, {
      method: "PATCH",
      // user: { id },
      // file: { filename: photo.name },
      body: dataToSend,
      headers: {
        // Don't set Content-Type when sending FormData - the browser will set it with the boundary
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await res.json();
    if (data.status === "success") return true;
    else throw new Error("Something went very wrong");
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function processPayment(tourId, jwt) {
  try {
    const res = await fetch(
      `${SERVER_URL}/bookings/checkout-session/${tourId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const data = await res.json();
    if (data.status === "success") {
      return data.session.url; // Return the Stripe checkout URL
    }
    throw new Error("Failed to create checkout session");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
