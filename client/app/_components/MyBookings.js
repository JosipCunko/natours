"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "./UserContext";
import TourCard from "./TourCard";
import { SERVER_URL } from "../_lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [tours, setTours] = useState([]);
  const { currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState();

  useEffect(
    function () {
      async function getMyBookings() {
        setIsLoading(true);
        const res = await fetch(`${SERVER_URL}/users/my-tours`, {
          headers: {
            Authorization: `Bearer ${currentUser?.jwt}`,
          },
          user: currentUser,
        });

        const data = await res.json();
        setTours(data.data); //ARRAY
        setIsLoading(false);
      }
      getMyBookings();
    },
    [currentUser]
  );
  if (isLoading)
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  if (tours?.length === 0) {
    <div className="message-container">
      <div className="message-box">
        <h1 className="heading-secondary">OOPS!</h1>
        <p className="description-text">You do not have any booked tours!</p>

        <Link href="/" className="btn btn-green">
          Start exploring <MoveRight />
        </Link>
      </div>
    </div>;
  }

  return (
    <div className="card-container">
      {tours?.map((tour) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </div>
  );
}
