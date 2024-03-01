import {useEffect, useState} from "react";
import { getAllServices } from "../../api/Service.api";
import Service from './Service'


export function ServiceList(){

    const [services, setServices] = useState([]);

    useEffect(() => {
        async function loadServices() {
            const res = await getAllServices();
            setServices(res.data.results);
            console.log(res)

        }
        loadServices();
    }, []);
    return <div>
            {services.map(service => (
                <Service key={service.id} service={service}/>
        ))}</div>
    
}