import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { getServiceByCityAndProfession, getAllProfessionsList } from "../../api/Service.api";

export default function Services() {
    const [city, setCity] = useState('');
    const [profession, setProfession] = useState('');
    const [services, setServices] = useState([]);
    const [professions, setProfessions] = useState([]);

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const res = await getAllProfessionsList();
                if (res.status === 200) {
                    const data = await res.json();
                    setProfessions(data.professions);
                } else {
                    console.error('No se pudieron cargar las profesiones');
                }
            } catch (error) {
                console.error('Error al cargar las profesiones', error);
            }
        };
        fetchProfessions();
    }, []);

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

        // Usado Copilot. Es para borrar algun timeout que se haya creado previamente
        let timeoutId = null;

        // Usado Copilot. Se establece el nuevo temporizador
        const handleTyping = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                getServices();
            }, 1000);
        };

        handleTyping();

        return () => clearTimeout(timeoutId);
    }, [city, profession]);

    

    return (
        <div>
            <section>
                <h1 className="text-4xl font-semibold text-center my-10">Encuentra el servicio que necesitas</h1>
            </section>
            <section className="px-5 lg:px-80 md:px-30 sm:px-20 py-6 ">
                
                <form className="flex flex-col sm:flex-row justify-center gap-2 my-4">
                
                    <input type="text" placeholder="Ciudad" className="border rounded px-2 py-1 font-semibold" value={city} onChange={(e) => setCity(e.target.value)} />
                    <select name="status" value={profession} onChange={(e) => setProfession(e.target.value)} className="px-2 py-1 border rounded bg-orange-200 font-semibold">
                        <option value=""> Profesion </option>
                        {professions.map((prof, index) => (
                            <option key={index} value={prof.id}>{prof.name}</option>
                        ))}
                    </select>
                </form>
            </section>

            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

                {services.filter(service => service.is_active).map(service => (
                    <ServiceCard key={service.id} service={service} />
                    
                ))}
            </section>
        </div>
    )
}