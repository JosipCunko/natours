//NOT USED - PROBLEM WITH GETTING JWT COOKIE

import { NextResponse } from "next/server";
import { SERVER_URL } from "../../_lib/utils";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = await cookies();
  const jwtCookie = cookieStore.get("jwt");

  if (!jwtCookie) {
    return NextResponse.json(
      { status: "error", message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${SERVER_URL}/users/my-tours`, {
      headers: {
        Authorization: `Bearer ${jwtCookie.value}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          status: "error",
          message: errorData.message || "Failed to fetch tours",
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
