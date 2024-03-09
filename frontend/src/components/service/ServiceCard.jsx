import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/Service.api";

export default function Service({ service }) {

  const [profession, setProfession] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (service.profession === 1) {
      setProfession("Lavandero");
    } else if (service.profession === 2) {
      setProfession("Celador");
    } else {
      setProfession("Albañil");
    }

    const getUser = async () => {
      try {
        const res = await getAllUsers();
        if (res.status === 200) {
          const data = await res.json();
          const matchingUser = data.results
          //console.log(service.user)
          //console.log(service.city)
          //console.log(matchingUser)
          const userWithMatchingId = matchingUser.find(user => user.id === service.user);
          setUser(userWithMatchingId);
        } else {
          alert('Error al cargar los usuarios');
        }
      } catch (error) {
        alert('Error al cargar los usuarios: ' + error.message);
      }
      
    };
    
    getUser();
  }, [service.profession, service.user, service.city]);

  //console.log(user)
  return (
    <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del servicio</h2>
      <p className="mb-2 mt-4"><strong>Nombre del ofertante:</strong> {user ? user.username : "Sin usuario asignado"}</p>
      <p className="mb-2"><strong>Profesión:</strong> {profession}</p>
      <p className="mb-2"><strong>Ciudad:</strong> {service.city}</p>
      <p className="mb-2"><strong>Experiencia:</strong> {service.experience}</p>
      <p className="mb-2"><strong>Idioma:</strong> {user ? user.language : "Sin asignar"}</p>
    </div>
  );
}
