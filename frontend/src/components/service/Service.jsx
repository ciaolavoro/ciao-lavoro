

// Muestra la vista de la oferta
export default function Service() {
  const service = {
    photo: "./src/assets/home/talonflame.jpg",
    name: "Talonflame",
    profession: "Bird",
    city: "Ciudad Luminalia",
    experience: "37",
    tasks: "Puedo volar de un lado a otro y comer pan",
    language: "Español, Inglés, Pajaro"

  }
  return (
    //Se ha usado IA para las partes relativas al uso de tailwind en este codigo

    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del servicio</h2>
      <img class="rounded-full w-96 h-96" src={service.photo} alt="foto del trabajador"></img>
      <p className="mb-2"><strong>Nombre del ofertante:</strong> {service.name}</p>
      <p className="mb-2"><strong>Profesión:</strong> {service.profession}</p>
      <p className="mb-2"><strong>Ciudad:</strong> {service.city}</p>
      <p className="mb-2"><strong>Experiencia:</strong> {service.experience}</p>
      <p className="mb-2"><strong>Tareas:</strong> {service.tasks}</p>
      <p className="mb-2"><strong>Idioma:</strong> {service.language}</p>
    </div>

  );
}




