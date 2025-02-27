"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="error-container">
      <div className="error-box">
        <h1 className="heading-secondary">Oops!</h1>
        <p className="description-text">{error.message}</p>

        <Link href="/" className="btn btn-green">
          Try again
        </Link>
      </div>
    </div>
  );
}
