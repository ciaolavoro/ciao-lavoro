import { useEffect, useState } from "react";
import { getUserById } from "../../api/Service.api";

export default function Service({ service }) {

  const [profession, setProfession] = useState("");
  const [user, setUser] = useState("");

  if (service.profession === 1) {
    setProfession("Lavandero");
  } else if (service.profession === 2) {
    setProfession("Celador");
  } else {
    setProfession("Albañil");
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getUserById(service.user);
        if (res.status === 200) {
          const data = await res.json();
          setUser(data);
        } else {
          alert('Error al cargar los usuarios');
        }
      } catch (error) {
        alert('Error al cargar los usuarios: ' + error.message);
      }
      
    };
    
    getUser();
  }, [service.profession, service.user, service.city]);

  return (
    <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
      <a href="#">
        <img src="https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NjZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                   className="h-80 w-80 object-cover rounded-t-xl" />
        <div className="px-4 py-3 w-72">
          
          <h2 className="text-2xl font-semibold"><strong></strong> {user.first_name} {user.last_name}</h2>
          <span className="text-gray-400 mr-3 uppercase text-s">@{user.username}</span>
          <br/>
          <span className="text-gray-500 mr-3 uppercase text-m font-semibold">{profession}</span>
          <p className="mb-2 mt-4"><strong>Ciudad:</strong> {service.city}</p>
          <p className="mb-2">
            <strong>Experiencia:</strong> {service.experience} {service.experience > 1 ? "años" : "año"}
          </p>
          <p className="mb-2"><strong>Idioma:</strong> {user && user.language ? user.language : "Sin idioma"}</p>
          
        </div>
      </a>
    </div>
  );
}
