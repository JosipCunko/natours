"use client";

import Link from "next/link";
import { useCurrentUser } from "./UserContext";
import { processPayment } from "../_lib/actions";
import { useState } from "react";

function Cta({ tourId, tourDuration }) {
  const { currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookTour = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const checkoutUrl = await processPayment(tourId, currentUser.jwt);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      alert("Failed to start payment process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cta__content">
      <h2 className="heading-secondary">What are you waiting for?</h2>
      <p className="cta__text">
        {tourDuration} days. 1 adventure. Infinite memories. Make it yours
        today!
      </p>
      {currentUser === null ? (
        <Link href="/login" className="btn btn--green span-all-rows">
          Log in to book tour
        </Link>
      ) : (
        <button
          onClick={handleBookTour}
          className="btn btn--green span-all-rows"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book tour now!"}
        </button>
      )}
    </div>
  );
}

export default Cta;
