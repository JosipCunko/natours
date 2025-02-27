import { NextResponse } from "next/server";
import { CLIENT_URL, SERVER_URL } from "../../_lib/utils";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tour = searchParams.get("tour");
  const price = searchParams.get("price");

  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!tour || !price || !token) {
    return NextResponse.json(
      { status: "fail", message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${SERVER_URL}/bookings/create-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tour,
        price: Number(price),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create booking");
    }

    return NextResponse.redirect(`${CLIENT_URL}/my-tours`);
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
