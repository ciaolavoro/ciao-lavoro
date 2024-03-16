const ListReview = ({ reviews }) => {
 return (
    <div className="flex flex-wrap justify-center">
      {reviews.map((review, index) => (
        <div key={index} className="flex m-4 w-full md:w-1/2 lg:w-1/3">
          <div className="flex flex-col items-center">
            <img src={review.profilePic} alt={`${review.name} ${review.surname}`} className="w-16 h-16 rounded-full mb-2" />
            <div>
              <p>{review.name} {review.surname}</p>
              <p>@{review.username}</p>
              <p>{review.profession}</p>
            </div>
          </div>
          <div className="flex flex-col items-center ml-4">
            <img src={review.profilePic} alt={`${review.name} ${review.surname}`} className="w-16 h-16 rounded-full mb-2" />
            <p>{review.reviewText}</p>
            <p>{review.reviewDate}</p>
            <div className="flex space-x-1">
              {[...Array(review.stars)].map((_, starIndex) => (
                <span key={starIndex} className="text-yellow-500">★</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
 );
};

export default ListReview;
