import { useEffect, useState } from "react";

export default function Service({ service }) {

  const [profession, setProfession] = useState("");
  useEffect(() => {
    if(service.profession === 1) {
      setProfession("Lavandero");
    } else if (service.profession === 2) {
      setProfession("Celador");
    } else {
      setProfession("Albañil");
    }
  }, [service.profession])

  return (
    <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del servicio</h2>
      <p className="mb-2 mt-4"><strong>Nombre del ofertante:</strong> {service.name}</p>
      <p className="mb-2"><strong>Profesión:</strong> {profession}</p>
      <p className="mb-2"><strong>Ciudad:</strong> {service.city}</p>
      <p className="mb-2"><strong>Experiencia:</strong> {service.experience}</p>
      <p className="mb-2"><strong>Tareas:</strong> {service.tasks}</p>
      <p className="mb-2"><strong>Idioma:</strong> {service.language}</p>
    </div>
  );
}




