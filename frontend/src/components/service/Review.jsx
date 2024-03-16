import  { useState } from 'react';

const Review = () => {
 const [rating, setRating] = useState(0);
 const [reviewText, setReviewText] = useState('');

 const handleRating = (value) => {
    setRating(value);
 };

 const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
 };

 const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Rating: ${rating}, Review: ${reviewText}`);
 };

 return (
    <div className="flex flex-col items-center">
      <br></br>
      <br></br>
      <br></br>
      <h2 className="mb-4 text-2xl font-bold">Deja tu valoración</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, index) => {
            //Esta parte ha sido generada con Inteligencia artificial
            const value = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                 type="radio"
                 name="rating"
                 value={value}
                 checked={rating === value}
                 onChange={() => handleRating(value)}
                 className="hidden"
                />
                <span className={`text-4xl ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
              </label>
            );
            // Hasta aquí
          })}
        </div>
        <textarea
          value={reviewText}
          onChange={handleReviewTextChange}
          placeholder="Escribe tu opinión aquí..."
          className="mt-4 w-full p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Enviar</button>
      </form>
    </div>
 );
};

export default Review;
