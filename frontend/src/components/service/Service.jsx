import talonFlame from "../../assets/service/talonflame.jpg";

export default function Service({ service }) {

  /*const service = {
    photo: {talonFlame},
    name: "Talonflame",
    profession: "Bird",
    city: "Ciudad Luminalia",
    experience: "37",
    tasks: "Puedo volar de un lado a otro y comer pan",
    language: "Español, Inglés, Pajaro"
  }*/

  return (
    <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del servicio</h2>
      <img className="mx-auto border rounded-full w-72 object-cover" src={talonFlame} alt="Foto del trabajador"></img>
      <p className="mb-2 mt-4"><strong>Nombre del ofertante:</strong> {service.name}</p>
      <p className="mb-2"><strong>Profesión:</strong> {service.profession}</p>
      <p className="mb-2"><strong>Ciudad:</strong> {service.city}</p>
      <p className="mb-2"><strong>Experiencia:</strong> {service.experience} años</p>
      <p className="mb-2"><strong>Tareas:</strong> {service.tasks}</p>
      <p className="mb-2"><strong>Idioma:</strong> {service.language}</p>
    </div>
  );
}




