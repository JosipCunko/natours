import { Calendar, Clock, Dumbbell, MapPin, Star, User } from "lucide-react";
import { SERVER_URL } from "../../_lib/utils";
import Map from "@/app/_components/Map";
import Cta from "@/app/_components/Cta";

function calcOutdatedDatesArray(datesArray, boolean = false) {
  const returnedDate = datesArray.map((date, i) => {
    const outdated = new Date(date).getTime() < new Date().getTime();
    if (outdated && i + 1 !== datesArray.length) return null;
    else return new Date(date).toLocaleDateString();
  });
  return boolean
    ? new Date().getTime() > new Date(returnedDate).getTime()
    : returnedDate;
}

async function TourPage({ params }) {
  const { tourId } = await params; //Somehow it needs to be awaited
  const res = await fetch(`${SERVER_URL}/tours/${tourId}`);
  const data = await res.json();
  if (data.status === "error") throw new Error("No tour found with that ID!");
  const tour = data.data.data;

  return (
    <div>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay"></div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <div className="heading-box__icon">
                <Clock />
              </div>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <MapPin />
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <div className="overview-box__icon">
                  <Calendar />
                </div>
                <span className="overview-box__label">
                  {calcOutdatedDatesArray(tour.startDates, true)
                    ? "Next "
                    : "Last "}
                  date
                </span>
                <span className="overview-box__text">
                  {calcOutdatedDatesArray(tour.startDates)}
                </span>
              </div>
              <div className="overview-box__detail">
                <div className="overview-box__icon">
                  <Dumbbell />
                </div>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <div className="overview-box__icon">
                  <User />
                </div>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <div className="overview-box__icon">
                  <Star />
                </div>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div key={guide._id} className="overview-box__detail">
                  <img
                    src={`/img/users/${guide.photo}`}
                    alt={guide.role}
                    className="overview-box__img"
                  />
                  <span className="overview-box__label">
                    {guide.role.replace("-", " ")}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">
            About the {tour.name} tour
          </h2>
          <p className="description__text">{tour.description}</p>
        </div>
      </section>

      <section className="section-pictures">
        {tour.images.map((image, i) => (
          <div key={i} className="picture-box">
            <img
              className={`picture-box__img picture-box__img--${i + 1}`}
              src={`/img/tours/${image}`}
              alt={`Image picture ${i + 1}`}
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        <Map locations={tour.locations} />
      </section>

      {tour.reviews.length > 0 && (
        <section className="section-reviews">
          <div className="reviews">
            {tour.reviews.map((review, i) => (
              <div className="reviews__card" key={review._id}>
                <div className="reviews__avatar">
                  <img
                    src={`/img/users/${review.user.photo}`}
                    alt={review.user.name}
                    className="reviews__avatar-img"
                  />
                  <h6 className="reviews__user">{review.user.name}</h6>
                </div>
                <p className="reviews__text">{review.review}</p>

                <div className="reviews__rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="reviews__rating" key={i}>
                      <Star
                        className={`reviews__star ${
                          i + 1 <= review.rating ? "reviews__star--active" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>

          {tour.images.map((image, i) => {
            if (i === 2) return null;
            else
              return (
                <img
                  key={i}
                  className={`cta__img cta__img--${i + 1}`}
                  src={`/img/tours/${image}`}
                  alt={`Image picture ${i + 1}`}
                />
              );
          })}

          <Cta tourId={tourId} tourDuration={tour.duration} />
        </div>
      </section>
    </div>
  );
}

export default TourPage;
