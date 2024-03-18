# Gestión de la Configuración - Ciao Lavoro

## MIEMBROS DEL EQUIPO:
- Alexander | Alicia Sánchez Hossdorf
- Álvaro Hidalgo Rodríguez
- Joaquín Arregui Díaz
- Samuel Albalat Ortiz
- Adrián García Chavero
- Pablo Cuenca Pérez
- Francisco Antonio Campos Campos
- Javier Grosso
- José Luis Cobo Ariza
- Diego González Quintanilla
- Antonio Barea Jiménez
- Pablo Mateos Angulo

## ISPP GESTIÓN DE LA CONFIGURACIÓN - Grupo-6
INGENIERÍA DEL SOFTWARE Y PRÁCTICA PROFESIONAL
GRUPO 6 | SEVILLA, 09 DE MARZO 2024 | ENTREGABLE “SPRINT 2”

### CONTROL DE VERSIONES
| FECHA      | VERSIÓN | DESCRIPCIÓN                                      |
|------------|---------|--------------------------------------------------|
| 20/02/2024 | 1.0     | Creación del documento                           |
| 25/02/2024 | 1.1     | Inclusión de ramas fix en apartado “Estrategia de ramas” |
| 28/02/2024 | 1.2     | Inclusión de los apartados 8 (Política de clockify) y 9 (Política de Issues) |
| 09/03/2024 | 1.2.1   | Añadido el texto "Sprint 2"                      |
| 09/03/2024 | 1.2.2   | Inclusion de reglas del tablero github en el apartado 9              |

### ÍNDICE

**Introducción.**	

[**Testing en Backend	4**]

[**Testing en Frontend	4**]




|**NOMBRE DEL PROYECTO:**|CiaoLavoro|
| - | - |
|**FECHA DE ELABORACIÓN:**|A 15 de Marzo de 2024|
|**ELABORADO POR:**|Grupo 6|

1. Introducción:

   Este documento pretende ser una guía para hacer un testing sencillo de nuestra aplicación.

   En la parte de backend haremos comprobaciones similares a las que se pueden hacer herramientas como Thunderclient. 

   El objetivo de realizar estas labores de testing no es trabajar por trabajar.

   La idea que perseguimos al realizar estas labores de testing es poder darnos cuenta de que algo que funcionaba ha dejado de funcionar y para cargar el workflow de github con un grupo de testeos que tengan que ser superados antes de realizar cargas de código de develop.

   Para ello se va a elaborar esta guía a seguir para realizar los testeos.

   Al final del documento se dejarán los enlaces a videos, playlists y documentación de donde se ha recogido la información en caso de que surjan dudas.


2. Testing Backend

   Como sabemos para el trabajo en backend estamos utilizando el Rest Framework de Django para hacer llamadas a las APIs.

   Para testear las APIViews, y si queréis también se puede usar para probar los modelos, haremos uso de Mixer.

   Mixer es una herramienta integrada en Django que facilita enormemente las tareas de testing. Gracias a Mixer puedes generar instancias de modelos, llamadas urls, probar parámetros de entrada y más.

   En este documento vamos a recoger como testear únicamente las APIViews pues es lo que nos interesa.

   Las funcionalidades que tenemos que probar a lo largo del proyecto son las CRUD. Todas ellas se van a testear de maneras muy parecidas.

   Analizaremos una secuencia de testing básica que nos enseñará la base. En los artículos adjuntos se podrá ver cómo hacer testing de funciones más avanzadas.

   Pongámonos en situación. Hemos creado el siguiente modelo:

   ![](./Imagenes_testing/Clase_estudiante.png)

   ![](./Imagenes_testing/Reestricciones_clase_estudiante.png)

   Y, sabiendo que usamos el rest\_framework, hemos creado las siguientes vistas:

   ![](./Imagenes_testing/APIViews_Student.png)






   Con las siguientes URLs:

   ![](./Imagenes_testing/Urls_Student.png)

   Y con el siguiente serializer:

   ![](./Imagenes_testing/Student_Serializer.png)

   Ahora que ya tenemos la base, comenzamos a montar nuestro tests.py.



   Creamos nuestra clase a la que llamaremos TestStudentAPIViews(TestCase) donde definiremos las distintas funciones de testing. La primera función que deberemos definir es la de setUp:

   ![](./Imagenes_testing/Setup_Test.png)

   El APIClient del Rest Framework nos permite logearnos en la API. Ese login que estamos viendo con el APIClient **NO** va a funcionar sin más. Nosotros utilizamos tokens para mantenernos logeados. 

   ![](./Imagenes_testing/Credentials_Login.png)

   Con ese extra a añadir ya deberíamos tener el setUp listo para nuestros tests.

   A continuación mostramos el ejemplo de un setUp mas parecido a lo que debemos hacer en nuestra aplicación para evitar confusiones:

   ![](./Imagenes_testing/EJemplo_Setup_Token.png)


   En primer lugar testeamos el listado de estudiantes.

   ![](./Imagenes_testing/Class_Student_List_Test.png)

   Creamos dos estudiantes haciendo uso de mixer:

   ![](./Imagenes_testing/Mixer_Students_List.png)

   A continuación debemos llamar a la URL de la lista de estudiantes que hemos definido en nuestro urls.py. Para ello solo debemos hacer uso de la siguiente línea donde llamadas al “name” que hemos definido al declarar el path:

   ![](./Imagenes_testing/Url_Call_Student_List.png)

   Y ahora llamamos a la URL a través de nuestro cliente definido para que nos devuelva los datos que tienen almacenado:

   ![](./Imagenes_testing/Response_Student_List.png)



   Ahora que ya tenemos la respuesta almacenada en nuestra variable “response” solo tenemos que comprobar su contenido con los clásicos “assert”, en el ejemplo comprueba que no esté vacío, que su tamaño sea dos (Hemos creado dos estudiantes) y que el status sea 200:

   ![](./Imagenes_testing/Assertions_Student_List.png)

   Finalmente dejamos una imagen de la función completa:

   ![](./Imagenes_testing/Student_List_Test.png)



   Continuando con el create, la mecánica es parecida. Iniciamos definiendo la función:
   ![](./Imagenes_testing/Class_Student_Create.png)

   A continuación, debemos definir un JSON que representa la información que tiene que recibir la función de creación de un estudiante. En nuestro caso de ejemplo se ve de la siguiente manera:

   ![](./Imagenes_testing/JSON_Student_Create.png)

   A partir de aquí la mecánica es la misma. Debemos llamar la url con la función “reverse” y el nombre de la url:

   ![](./Imagenes_testing/Url_Student_Create.png)

   Llamar la respuesta de la url (en este caso hacemos un post e incluimos el JSON que hemos definido):

   ![](./Imagenes_testing/Response_Student_Create.png)

   Y comprobarla con los assert, en este caso probamos el 201 porque es el código de creación correcta:

   ![](./Imagenes_testing/Assertions_Student_Create.png)

   Dejamos una foto de la función completa:
   ![](./Imagenes_testing/Test_Student_Create.png)

   Ahora continuaremos con la vista de detalles de un estudiante. La mecánica es muy parecida, pero en este caso necesitamos la id del estudiante para entrar en los detalles. 

   ![](./Imagenes_testing/Class_Student_Detail.png)

   Este id lo conseguimos al tener una creación ligeramente diferente con el mixer en la que incluimos un valor para su pk. Para ello usaremos los kwargs para indicarle a reverse de que estudiante queremos sus detalles:

   ![](./Imagenes_testing/Students_Detail_Creations.png)

   Los assert se mantienen iguales. En este caso volvemos a buscar un 200 ya que estamos ante un get:
   ![](./Imagenes_testing/Assertions_Student_Detail.png)

   FInalmente dejamos la función completa:

   ![](./Imagenes_testing/Test_Student_Detail.png)

   Para terminar repasaremos brevemente el delete. No vamos a indagar ya que es la misma idea que en la vista de detalle. Mostraremos su función completa donde se observa esto mismo:
   ![](./Imagenes_testing/Test_Delete_Student.png)

3. Testing en Frontend



