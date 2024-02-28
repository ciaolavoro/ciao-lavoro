import React from 'react'
import './index.css'

// Muestra la vista de la oferta
function service({ service }) {
  return (
    //Se ha usado IA para las partes relativas al uso de tailwind en este codigo

      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del servicio</h2>
      <p className="mb-2"><strong>Nombre del ofertante:</strong> {service.user.name}</p>
      <p className="mb-2"><strong>Profesión:</strong> {service.profession}</p>
      <p className="mb-2"><strong>Ciudad:</strong> {service.city}</p>
      <p className="mb-2"><strong>Experiencia:</strong> {service.experience}</p>
      <p className="mb-2"><strong>Tareas:</strong> {service.tasks}</p>
      <p className="mb-2"><strong>Idioma:</strong> {service.user.language}</p>
    </div>

  );
}

export default offerView;


