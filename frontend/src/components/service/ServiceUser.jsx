import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { getServiceByUser } from "../../api/Service.api";

export default function ServiceUser(){

    const [services, setServices] = useState([]);

    useEffect(() => {
        const getServices = async () => {
            try {
                const res = await getServiceByUser(id);
                if (res.status === 200) {
                    const data = await res.json();
                    setServices(data);
                } else {
                    alert('Error al cargar los servicios');
                }
            } catch (error) {
                alert('Error al cargar los servicios');
            }
            
        };getServices;
        
    });
    return(
        <div>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

                {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </section>
        </div>
        
    )
}