// app/api/auth/me/route.js
import { cookies } from "next/headers";
import { SERVER_URL } from "../../_lib/utils";

export async function GET() {
  const cookieStore = await cookies();
  const jwtCookie = cookieStore.get("jwt"); // awaited

  if (!jwtCookie) {
    return Response.json({ isLoggedIn: false });
  }

  try {
    // Forward the JWT to your backend to validate and get user data
    const response = await fetch(`${SERVER_URL}/users/me`, {
      headers: {
        Cookie: `jwt=${jwtCookie.value}`,
        Authorization: `Bearer ${jwtCookie.value}`, // Some APIs prefer this
      },
    });

    if (!response.ok) {
      return Response.json({ isLoggedIn: false });
    }

    const userData = await response.json();

    return Response.json({
      jwt: jwtCookie,
      isLoggedIn: true,
      user: userData,
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return Response.json({ isLoggedIn: false });
  }
}
