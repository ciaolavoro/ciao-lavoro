import { useEffect, useState } from "react";
import { getServiceByUser, getUserLogged } from "../../api/Service.api";
import ServiceUserCard from "./ServiceUserCard";

export default function ServiceUser(){

    const [services, setServices] = useState([]);
    const [userID, setUserID] = useState(0);

    useEffect(() => {
        const getUserID = async () => {
            try {
                const res = await getUserLogged();
                console.log(res);
                if (res.status === 200) {
                    const data = await res.json();
                    console.log(data);
                    setUserID(data);
                } else {
                    alert('Error al cargar el usuario');
                }
            } catch (error) {
                alert('Error al cargar el usuario');
            }
        }; getUserID;

        const getServices = async () => {
            try {
                const res = await getServiceByUser(userID);
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
        <section>
                <h1 className="text-4xl font-semibold text-center my-10">Todos los servicios que ofreces</h1>
        </section>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

                {services.map(service => (
                    <ServiceUserCard key={service.id} service={service} />
                ))}
            </section>
        </div>
        
    )
}