# Proyecto de ISPP

Proyecto destinado para la asignatura de ISPP.

## ⚙ Guía de inicio

Breve guía de inicio necesaria para comenzar a desarrollar el proyecto. Será necesario que tengas instalada la última versión de [Python](https://www.python.org/downloads/) y de [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Además, es recomendable que tengas la [extensión de Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) en VSCode.

Antes de empezar es necesario que te encuentres en el directorio raíz. 

1. Instalar Django.
```
pip install Django
```
2. Instalar los paquetes necesarios para Django.
```
pip install djangorestframework django-cors-headers
```
3. Moverse a la carpeta frontend con `cd frontend` e instalar las dependencias.
```
npm install
```
4. En el mismo terminal, ejecutar el servidor del frontend.
```
npm run dev
```
5. Abre un nuevo terminal en el directorio raíz, y muévete al backend con `cd backend` para ejecutar el servidor del backend.
```
python manage.py runserver
```
6. ✅ ¡Listo! Si no has tenido ningún problema en el proceso, ya puedes usar la aplicación y desarrollarla.