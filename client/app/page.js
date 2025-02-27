import TourCard from "./_components/TourCard";
import { SERVER_URL } from "./_lib/utils";

export default async function Home() {
  const response = await fetch(`${SERVER_URL}/tours`);
  const data = await response.json();
  const tours = data.data.data;

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </main>
  );
}
