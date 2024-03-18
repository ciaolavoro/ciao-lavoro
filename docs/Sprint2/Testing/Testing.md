
**ISPP                         GESTIÓN DE LA CONFIGURACIÓN\_\_\_             \_\_\_\_Grupo-6** 














Gestión de los testeos.![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.001.png)

CiaoLavoro

MIEMBROS DEL EQUIPO:



-Alexander | Alicia Sánchez Hossdorf

\- Álvaro Hidalgo Rodríguez

\- Joaquín Arregui Díaz

\- Samuel Albalat Ortiz

\- Adrián García Chavero

\- Pablo Cuenca Pérez

\- Francisco Antonio Campos Campos

\- Javier Grosso

\- José Luis Cobo Ariza

\- Diego González Quintanilla

\- Antonio Barea Jiménez

\- Pablo Mateos Angulo






INGENIERÍA DEL SOFTWARE Y PRÁCTICA PROFESIONAL

GRUPO 6 | SEVILLA, 15 DE MARZO 2024 | 

ENTREGABLE “SPRINT 2”
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.002.png)![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.003.png)


<a name="_heading=h.gjdgxs"></a>**CONTROL DE VERSIONES**	

|**FECHA**|**VERSIÓN**|**DESCRIPCIÓN**|
| - | - | - |
|15/03/2024|1\.0|Primera versión|
||||
||||



Página  PAGE 1 de 9

**ISPP**
![ref1]![ref2]![ref3]
**ISPP                         GESTIÓN DE LA CONFIGURACIÓN\_\_\_             \_\_\_\_Grupo-6** 



![ref1]


**ÍNDICE**
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.007.png)


Contenido

[**Introducción.	4**](#_heading=h.83api1jeupbe)**

[**Testing en Backend	4**](#_heading=h.w90sfbc2kusj)

[**Testing en Frontend	4**](#_heading=h.55ar5i9ws06d)
#
#
#
#
#
#
#
#
#
#
#
#



<a name="_heading=h.j0y0nzfq8847"></a><a name="_heading=h.f2itxea42wza"></a><a name="_heading=h.xd7igyv6uckb"></a><a name="_heading=h.3y0mfuq3vin6"></a><a name="_heading=h.1qx06yhvxwvl"></a><a name="_heading=h.9zre4yzhx6s7"></a><a name="_heading=h.infoifgq8gs"></a><a name="_heading=h.yd8f7xj3lszg"></a><a name="_heading=h.604ddvwi6j46"></a><a name="_heading=h.2iub7pmvpx87"></a><a name="_heading=h.aumzxq50clmq"></a><a name="_heading=h.ulsbmiicfspq"></a>Página  PAGE 2 de 9

**ISPP**


![ref3]![ref1]![ref2]

**ISPP                         GESTIÓN DE LA CONFIGURACIÓN\_\_\_             \_\_\_\_Grupo-6**



![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.008.png)

**DATOS GENERALES DEL PROYECTO**
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.009.png)

|**NOMBRE DEL PROYECTO:**|CiaoLavoro|
| - | - |
|**FECHA DE ELABORACIÓN:**|A 15 de Marzo de 2024|
|**ELABORADO POR:**|Grupo 6|







































1. # <a name="_heading=h.83api1jeupbe"></a>**Introducción.**
   Este documento pretende ser una guía para hacer un testing sencillo de nuestra aplicación.

   En la parte de backend haremos comprobaciones similares a las que se pueden hacer herramientas como Thunderclient. 

   El objetivo de realizar estas labores de testing no es trabajar por trabajar.

   La idea que perseguimos al realizar estas labores de testing es poder darnos cuenta de que algo que funcionaba ha dejado de funcionar y para cargar el workflow de github con un grupo de testeos que tengan que ser superados antes de realizar cargas de código de develop.

   Para ello se va a elaborar esta guía a seguir para realizar los testeos.

   Al final del documento se dejarán los enlaces a videos, playlists y documentación de donde se ha recogido la información en caso de que surjan dudas.

#

































1. # <a name="_heading=h.ylzw3uixtjrc"></a><a name="_heading=h.w90sfbc2kusj"></a>**Testing en Backend.**

   Como sabemos para el trabajo en backend estamos utilizando el Rest Framework de Django para hacer llamadas a las APIs.

   Para testear las APIViews, y si queréis también se puede usar para probar los modelos, haremos uso de Mixer.

   Mixer es una herramienta integrada en Django que facilita enormemente las tareas de testing. Gracias a Mixer puedes generar instancias de modelos, llamadas urls, probar parámetros de entrada y más.

   En este documento vamos a recoger como testear únicamente las APIViews pues es lo que nos interesa.

   Las funcionalidades que tenemos que probar a lo largo del proyecto son las CRUD. Todas ellas se van a testear de maneras muy parecidas.

   Analizaremos una secuencia de testing básica que nos enseñará la base. En los artículos adjuntos se podrá ver cómo hacer testing de funciones más avanzadas.

   Pongámonos en situación. Hemos creado el siguiente modelo:

   ![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.010.png)

   ![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.011.png)

`	`Y, sabiendo que usamos el rest\_framework, hemos creado las siguientes vistas:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.012.png)






Con las siguientes URLs:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.013.png)

Y con el siguiente serializer:

`	`![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.014.png)

`	`Ahora que ya tenemos la base, comenzamos a montar nuestro tests.py.



`	`Creamos nuestra clase a la que llamaremos TestStudentAPIViews(TestCase) donde definiremos las distintas funciones de testing. La primera función que deberemos definir es la de setUp:

`	`![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.015.png)










El APIClient del Rest Framework nos permite logearnos en la API. Ese login que estamos viendo con el APIClient **NO** va a funcionar sin más. Nosotros utilizamos tokens para mantenernos logeados. 

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.016.png)

Con ese extra a añadir ya deberíamos tener el setUp listo para nuestros tests.

A continuación mostramos el ejemplo de un setUp mas parecido a lo que debemos hacer en nuestra aplicación para evitar confusiones:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.017.png)


En primer lugar testeamos el listado de estudiantes.

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.018.png)

Creamos dos estudiantes haciendo uso de mixer:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.019.png)

A continuación debemos llamar a la URL de la lista de estudiantes que hemos definido en nuestro urls.py. Para ello solo debemos hacer uso de la siguiente línea donde llamadas al “name” que hemos definido al declarar el path:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.020.png)

Y ahora llamamos a la URL a través de nuestro cliente definido para que nos devuelva los datos que tienen almacenado:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.021.png)



Ahora que ya tenemos la respuesta almacenada en nuestra variable “response” solo tenemos que comprobar su contenido con los clásicos “assert”, en el ejemplo comprueba que no esté vacío, que su tamaño sea dos (Hemos creado dos estudiantes) y que el status sea 200:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.022.png)

Finalmente dejamos una imagen de la función completa:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.023.png)



Continuando con el create, la mecánica es parecida. Iniciamos definiendo la función:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.024.png)

A continuación, debemos definir un JSON que representa la información que tiene que recibir la función de creación de un estudiante. En nuestro caso de ejemplo se ve de la siguiente manera:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.025.png)

A partir de aquí la mecánica es la misma. Debemos llamar la url con la función “reverse” y el nombre de la url:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.026.png)

` `Llamar la respuesta de la url (en este caso hacemos un post e incluimos el JSON que hemos definido):

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.027.png)

Y comprobarla con los assert, en este caso probamos el 201 porque es el código de creación correcta:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.028.png)












Dejamos una foto de la función completa:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.029.png)

Ahora continuaremos con la vista de detalles de un estudiante. La mecánica es muy parecida, pero en este caso necesitamos la id del estudiante para entrar en los detalles. 

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.030.png)










Este id lo conseguimos al tener una creación ligeramente diferente con el mixer en la que incluimos un valor para su pk. Para ello usaremos los kwargs para indicarle a reverse de que estudiante queremos sus detalles:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.031.png)

Los assert se mantienen iguales. En este caso volvemos a buscar un 200 ya que estamos ante un get:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.032.png)

FInalmente dejamos la función completa:

![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.033.png)

Para terminar repasaremos brevemente el delete. No vamos a indagar ya que es la misma idea que en la vista de detalle. Mostraremos su función completa donde se observa esto mismo:
![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.034.png)

1. # <a name="_heading=h.55ar5i9ws06d"></a>**Testing en Frontend.**











































<a name="_heading=h.30j0zll"></a>**APROBACIÓN**	

|**Nombre**|**Cargo**|**Firma**|**Fecha**|
| - | - | - | - |
|<p></p><p></p><p></p><p></p><p>Francisco Antonio Campos</p>|<p></p><p></p><p></p><p></p><p></p><p>Coordinador de Documentación</p>|<p></p><p></p><p></p><p>![](Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.035.png)</p>|<p></p><p></p><p></p><p>10/02/2024</p>|

Página  PAGE 5 de 9

**ISPP**


![ref3]![ref1]![ref2]

[ref1]: Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.004.png
[ref2]: Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.005.png
[ref3]: Aspose.Words.b3f528c8-ee73-4ed4-80e7-4211abfa77c7.006.png
