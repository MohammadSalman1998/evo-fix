// src\components\SingleReview.tsx
const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

export type SingleReviewType = {
    id: number;
  rating: number;
  comment: string;
  user: {
    fullName: string;
  };
  };

const SingleReview = ({ review }: { review: SingleReviewType }) => {
  const { rating, user, comment } = review;

  // eslint-disable-next-line prefer-const
  let ratingIcons = [];
  for (let index = 0; index < rating; index++) {
    ratingIcons.push(
      <span key={index} className="text-yellow">
        {starIcon}
      </span>,
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md mx-6 bg-white p-8 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark lg:px-5 xl:px-8">
        <div className="mb-5 flex items-center space-x-1">{ratingIcons}</div>
        <p className="mb-8 border-b border-body-color border-opacity-10  text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
        {comment}
        </p>
        <div className="flex items-center">
          {/* <div className="relative mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
            <Image src={image} alt={name} fill />
          </div> */}
          <div className="w-full">
            <h3 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">
              {user.fullName}
            </h3>
            {/* <p className="text-sm text-body-color">{designation}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleReview;
