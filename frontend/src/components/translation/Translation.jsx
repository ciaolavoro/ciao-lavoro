import { useState } from "react";

export default function Translation() {
    const [translatedText, setTranslatedText] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const options = {
            method: "POST",
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '3d2ba4298fmsh27dfae92ac8622cp16eb18jsn97e0f6948e42',
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            body: new URLSearchParams({
                source_language: 'en',
                target_language: 'id',
                text: `${formData.get('originalText')}`
            })
        }
        const response = await fetch('https://text-translator2.p.rapidapi.com/translate', options);
        const data = await response.json();
        setTranslatedText(data.data.translatedText);
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <h1 className="text-3xl">Formulario de traduccion de Ingles a Indonesiano</h1>
            <form action="post" onSubmit={handleSubmit}>
                <label htmlFor="text" />
                <input type="text" name="originalText" placeholder="Introduzca el texto en inglés a traducir..." className="w-96 border rounded p-2 mr-2" />
                <button type="submit" className="p-1 border rounded bg-yellow-400">Enviar</button>
            </form>
            {translatedText && <p className="text-lg">{translatedText}</p>}
        </div>
    )
}