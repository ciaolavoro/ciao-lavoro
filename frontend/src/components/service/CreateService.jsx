import { useState } from "react";

const createServiceUrl = '/api/service/create';

export default function CreateService() {
    const [formData, setFormData] = useState({
        profession: '',
        city: '',
        experience: 0,
        is_active: true,
        is_promoted: false
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        try {
            await fetch(createServiceUrl, options);
            alert('Servicio creado exitosamente!');
        } catch (error) {
            console.error('Error al crear servicio:', error);
        }
    };

    return (
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del servicio</h1>
            <div className="flex items-center gap-2">
                <label>Profesión:</label>
                <select name="profession" value={formData.profession} onChange={handleChange} className="px-2 py-1 border rounded">
                    <option value="programador">Programador</option>
                    <option value="diseñador">Diseñador</option>
                    <option value="contador">Contador</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label>Ciudad:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Experiencia:</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                    <label htmlFor="is_active">Activo</label>
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={() => setFormData({ ...formData, is_active: !formData.is_active })} className="mr-2" />
                </div>
                <div className="flex gap-2">
                    <label htmlFor="is_promoted">Promoción</label>
                    <input type="checkbox" name="is_promoted" checked={formData.is_promoted} onChange={() => setFormData({ ...formData, is_promoted: !formData.is_promoted })} className="mr-2" />
                </div>
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Servicio</button>
        </form>
    );
}