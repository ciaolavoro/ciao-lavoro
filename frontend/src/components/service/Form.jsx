import React, { useState } from 'react';
import Navbar from "../Navbar";
import Background from "../Background";

const CrearServiceForm = () => {
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

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await fetch('/api/crear-servicio/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            alert('Servicio creado exitosamente!');
            // Lógica adicional después de crear el servicio, por ejemplo, redireccionar.
        } catch (error) {
            console.error('Error al crear servicio:', error);
            // Manejo de errores
        }
    };

    return (
        <div className="relative font-sans">
        <Navbar />
        <Background />
        <form className="flex flex-col items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                <label className="mb-2">Profesión:</label>
                <select name="profession" value={formData.profession} onChange={handleChange} className="px-2 py-1 border rounded">
                    <option value="programador">Programador</option>
                    <option value="diseñador">Diseñador</option>
                    <option value="contador">Contador</option>
                    {/* Agrega más opciones según necesites */}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <label className="mb-2">Ciudad:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex flex-col items-center">
                <label className="mb-2">Experiencia:</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={() => setFormData({ ...formData, is_active: !formData.is_active })} className="mr-2" />
                <label className="mb-2">Activo</label>
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="is_promoted" checked={formData.is_promoted} onChange={() => setFormData({ ...formData, is_promoted: !formData.is_promoted })} className="mr-2" />
                <label className="mb-2">Promoción</label>
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Servicio</button>
        </form>
    </div>
    );
};

export default CrearServiceForm;
