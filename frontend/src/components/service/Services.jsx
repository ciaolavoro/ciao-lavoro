import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { getServiceByCityAndProfession } from "../../api/Service.api";

export default function Services() {
    const [city, setCity] = useState('');
    const [profession, setProfession] = useState('');
    const [services, setServices] = useState([]);

    useEffect(() => {
        const getServices = async () => {
            try {
                const res = await getServiceByCityAndProfession(city, profession);
                if (res.status === 200) {
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
    }, [city, profession]);

    return (
        <div>
            <section>
                <form className="flex justify-center gap-2 my-4">
                    <input type="text" placeholder="Ciudad" className="w-96 pl-2 border rounded" value={city} onChange={(e) => setCity(e.target.value)} />
                    <select name="status" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-96 pl-2 border rounded">
                        <option value=""> Profesion </option>
                        <option value="1">Lavandero</option>
                        <option value="2">Celador</option>
                        <option value="3">Albañil</option>
                    </select>
                </form>
            </section>
            <section>
                {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </section>
        </div>
    )
}