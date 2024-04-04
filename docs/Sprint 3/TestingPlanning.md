# GESTION DE LA CONFIGURACION

## CIAOLAVORO
**Grupo 6**
<br>
**Entregable: Sprint 3**

## Miembros del equipo y contribuciones

| Nombre y Apellidos | Tipo de Contribución |
|---------------------|-----------------------|
| Pablo Cuenca       | Redacción           |

### CONTROL DE VERSIONES
| FECHA      | VERSIÓN | DESCRIPCIÓN                                      |
|------------|---------|--------------------------------------------------|
| 04/04/2024 | 1.0     | Creación del documento                           |

## 1. Introducción.

Este documento tiene el propósito de presentar la motivación de la labor de testing en el proyecto de Ciao Lavoro. El objetivo que debemos tener en mente a la hora de crear el testing es mantener el código en funcionamiento. Es decir, pretendemos que el testing nos ayude a que cuando hacemos labores de código en un ámbito, asegurarnos de una manera rápida que no hemos afectado a otras ramas de la aplicación.

## 2. Alcance.

No pretendemos que nuestro testing tenga un alcance superlativo. Debemos probar que todas las funcionalidades que tenemos en la aplicación funcionen como se esperan. No pretendemos hacer gala de un testing demasiado sofisticado, nos limitaremos a comprobar que cada pieza de código funciona. Gracias a esto podremos comprobar si cualquier cambio ha provocado un efecto negativo, que es el motivo principal por el que realizamos los testeos.

## 3. Roles y responsabilidades.

Debido al tamaño del equipo de trabajo *todos* los miembros del equipo de backend son responsables de testear partes de código. Dado el número de miembros no podemos permitirnos dedicar un equipo exclusivamente a QA. Dado que los fragmentos de código son realizados en pareja los dos miembros de la pareja son encargados de que el test sea realizado. Como hemos estado realizando hasta ahora, si un miembro de la pareja realiza el código, el otro miembro está encargado de asegurar que todo está correcto.

## 4. Recursos.

Dado que ya se ha realizado durante el Sprint 2 la guía de testing tan solo debemos seguir las instrucciones de la guía junto con el mismo entorno que nos proporciona el Rest Framework para realizar las pruebas.

No debemos instalar ninguna dependencia externa a lo que ya disponemos en el proyecto.

## 5. Estrategia de prueba.

Como hemos mencionado anteriormente, el objetivo principal de las pruebas que realizamos es asegurarnos que cada módulo funciona como se espera a nivel básico.

Dberemos probar los casos de prueba positivos y los casos negativos básicos, no necesitamos hacer cientos de líneas de código. El objetivo es que sea básico, sencillo y que cumpla su función principal.

## 6. Herramientas y técnicas de prueba

Para las herramientas y técnicas consultar el documento "Testing.md".

## 7. Criterios de aceptación.

Se considera que una prueba es exitosa cuando el resultado es el esperado por parte del usuario, es decir, si estamos probando un caso de prueba positivo podrá ser aceptado cuando devuelven un valor positivo y al contrario en los casos negativos, deberán ser aceptados cuando los resultados tengan un valor negativo.

