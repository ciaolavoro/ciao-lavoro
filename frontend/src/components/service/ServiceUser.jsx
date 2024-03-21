import { useEffect, useState } from "react";
import { getServiceByUser } from "../../api/Service.api";
import ServiceUserCard from "./ServiceUserCard";
import { useAuthContext } from "../auth/AuthContextProvider";
import LinkButton from "../home/LinkButton";

export default function ServiceUser(){

    const [services, setServices] = useState([]);
    const { loggedUser } = useAuthContext();
    useEffect(() => {
        const getServices = async () => {
            try {
                
                const res = await getServiceByUser(loggedUser.user.id);
                if (res.status === 200) {
                    const data = await res.json();
                    setServices(data);
                } else {
                    alert('Error al cargar los servicios');
                }
            } catch (error) {
                alert('Error al cargar los servicios');
            }
            
        };getServices();
    },[loggedUser]);
    return(
        <div>
        <section>
                <h1 className="text-4xl font-semibold text-center my-10">Todos los servicios que ofreces</h1>
        </section>
        <section>
            <div className="flex justify-center gap-x-8 my-4">
                <LinkButton url="/service/create" title="Crear servicio" />
            </div>
        </section>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

                {services.map(service => (
                    <ServiceUserCard key={service.id} service={service} />
                ))}
            </section>
        </div>
        
    )
}