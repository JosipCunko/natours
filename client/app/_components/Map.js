"use client";
import React from "react";

import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const MapComponent = ({ locations = [] }) => {
  // This component will only be imported client-side
  const MapWithNoSSR = dynamic(() => import("./MapClientSide"), {
    loading: () => (
      <div
        style={{
          height: "500px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        Loading Map...
      </div>
    ),
    ssr: false, // Disable server-side rendering
  });

  // Pass the locations to the client-side component
  return <MapWithNoSSR locations={locations} />;
};

export default MapComponent;
