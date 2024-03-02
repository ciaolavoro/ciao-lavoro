import { useEffect, useState } from "react";
import { getAllServices } from "../../api/Service.api";
import Service from "./Service";



export default function ServiceList() {

    const [services, setServices] = useState([]);

    useEffect(() => {
        const getServices = async () => {
            try {
                const res = await getAllServices();
                if(res.status === 200){
                    const data = await res.json();
                    setServices(data);
                } else {
                    alert('Error al cargar los servicios');
                }
            } catch (error) {
                alert('Error al cargar los servicios');
            }
        };
        getServices();
    }, []);

    return (
        <div>
            {services.map(service => (
                <Service key={service.id} service={service} />
            ))}
        </div>
    )

}
