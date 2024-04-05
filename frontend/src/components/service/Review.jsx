import { useState } from 'react';
import { createServiceReview } from '../../api/Service.api';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContextProvider";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitAttemptedWithoutRating, setSubmitAttemptedWithoutRating] = useState(false);
  const navigate = useNavigate();
  const { loggedUser } = useAuthContext();
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');

  const handleRating = (value) => {
    setRating(value);
    if (value > 0) {
      setSubmitAttemptedWithoutRating(false);
    }
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value.trimStart());
  };

  const createReview = async (rating, review) => {
    try {
      const res = await createServiceReview(service_id, rating, review, loggedUser.token);
      if (res.status === 200) {
        alert('La valoración se ha creado correctamente');
        navigate('/');
      } else {
        alert('Error al crear la valoración. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      alert('Error al crear la valoración. Por favor, inténtelo de nuevo.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rating) {
      setSubmitAttemptedWithoutRating(true);
      alert('Por favor, selecciona una calificación antes de enviar tu reseña.');
      return;
    }
    if (!reviewText.trim()) {
      alert('El campo de texto no puede estar vacío ni lleno de espacios en blanco.');
      return;
    }

    createReview(rating, reviewText);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Deja tu valoración</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, index) => {
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
                    // Remove the required attribute to prevent the default browser validation message
                  />
                  <span className={`text-4xl ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                </label>
              );
            })}
          </div>
          {submitAttemptedWithoutRating && <p className="text-red-500">Por favor, selecciona una calificación.</p>}
          <textarea
            value={reviewText}
            onChange={handleReviewTextChange}
            placeholder="Escribe tu opinión aquí..."
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Review;
