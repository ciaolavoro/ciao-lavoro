# GESTION DE LA CONFIGURACION

## CIAOLAVORO
**Grupo 6**
<br>
**Entregable: Sprint 2**

## Miembros del equipo y contribuciones

| Nombre y Apellidos | Tipo de Contribución |
|---------------------|-----------------------|
| Javier Grosso         | Redacción           |

### CONTROL DE VERSIONES
| FECHA      | VERSIÓN | DESCRIPCIÓN                                      |
|------------|---------|--------------------------------------------------|
| 20/02/2024 | 1.0     | Creación del documento                           |
| 25/02/2024 | 1.1     | Inclusión de ramas fix en apartado “Estrategia de ramas” |
| 28/02/2024 | 1.2     | Inclusión de los apartados 8 (Política de clockify) y 9 (Política de Issues) |
| 09/03/2024 | 1.2.1   | Añadido el texto "Sprint 2"                      |
| 09/03/2024 | 1.2.2   | Inclusion de reglas del tablero github en el apartado 9              |
| 20/03/2024 | 1.2.2   | Inclusion de las ramas de Hotfix              |
| 22/03/2024 | 1.3   | Modificacion de los mensajes de commit             |
| 26/03/2024 | 1.4   | Modificacion de la politica de clockify para las theory pills             |

### Contenido
1. Estrategia de ramas:
El proyecto contendrá dos ramas principales: main y develop.
La rama main es donde se localiza la versión más reciente del proyecto revisada y lista para su lanzamiento.
La rama develop es la versión en desarrollo del proyecto, donde se implementan las funcionalidades y se completan las
issues. Las siguientes ramas realizarán Pull Requests a develop para avanzar en el proyecto:
- Rama Task: Se creará una rama por cada issue a realizar de forma independiente, usando la rama develop
como rama de origen. El nombre de las ramas de Task seguirá el siguiente patrón: Task Y.X - Nombre de la
tarea/Z, donde Y es el sprint, X es el número asignado a la Task en el tablero Project y Z es el número de la
issue relacionada (sin el hashtag). Cada dúo de desarrolladores es responsable de crear su rama de trabajo.
- Rama Fix: Para la creación de ramas Fix, el patrón correspondiente será: Fix Y.X - Nombre del arreglo/Z, donde
Y es el sprint, X es el número asignado al Fix en el tablero Project y Z es el número de la issue de Github
relacionada (sin el hashtag). El nombre del arreglo debe ser breve y conciso.
Las ramas de tarea/feature y de arreglo/fix se crearán desde dentro de la Issue de github. Dentro de las issues, clickear
en “Create a branch” en el apartado Development, desde ahí se pueden crear las ramas siguiendo lo explicado en este
apartado.
- Rama Hotfix: Para la creación de ramas Fix, el patrón correspondiente será: Hotfix Y.X - Nombre del arreglo/Z, donde Y es el sprint, X es el número asignado al Hotfix en el tablero Project y Z es el número de la issue de Github relacionada (sin el hashtag). El nombre del arreglo debe ser breve y conciso. Los Hotfix son arreglos grandes en tamaño que involucran backend y frontend.
El trabajo de las funcionalidades se realizarán en sus ramas de tarea individuales, una vez que una feature esté
completada se meterá en la rama de develop, y posteriormente una vez probado que develop funciona se hace merge
de develop en main.

2. Política de pull request:
Al completar una funcionalidad en una rama de tareas, los desarrolladores involucrados revisarán que el
funcionamiento es óptimo y funcional.
Posteriormente, se hace una pull request hacia la rama develop. Esta pull request debe ser revisada y verificada por un
desarrollador externo a la funcionalidad, escribiendo un comentario, pero si algo está mal, rechaza la pull request y los
desarrolladores deben arreglar el error. Cuando se ha terminado este proceso, se hace merge a develop.
Cuando se han completado todas las funcionalidades de un sprint o se considera que la rama develop está preparada
para el lanzamiento, se comprueba que todo funcione correctamente y no existan fallos de integración. Después, se
realiza un pull request a main, el cual debe ser revisado por dos desarrolladores, escribiendo un comentario. Una vez se
complete este proceso, se puede hacer merge de develop a main.
Pero, de una rama de tarea a main nunca deben existir merges, los merges de las ramas de tarea van a develop.
El título de las Pull request debe seguir la siguiente estructura:
Task Y.X - Nombre de la tarea/Z DONE, donde Y es el sprint, X es el número asignado a la tarea y Z es el número de la
issue relacionada (# no).
Y para los pull requests de ramas arreglo/fix, el patrón correspondiente será: Fix Y.X - Nombre del arreglo/Z FIXED,
donde Y es el sprint, X es el número asignado a la tarea y Z el número de la issue relacionada (# no).
En caso de Hotfix, el patrón correspondiente será: Hotfix Y.X - Nombre del arreglo/Z FIXED, donde Y es el sprint, X es el número asignado a la tarea y Z el número de la issue relacionada (# nº). 

3. Política del tablero:
A continuación, se explicará la política que se va a seguir durante el desarrollo de la aplicación para el tablero
de cada sprint del proyecto:
- Todo: Contiene las tareas listas para realizar por los desarrolladores.
- In Progress: Se tratan de las tareas que se encuentran en desarrollo en ese instante.
- In Review: Tareas que se encuentran en revisión o pendientes de revisión.
- Done: Contiene las tareas finalizadas del proyecto.

4. Estructura de carpetas y archivos:
4.1. Frontend
La estructura de carpetas que se va a seguir durante el desarrollo del frontend se realizará de forma
que exista un directorio por cada página (url) que haya en de la aplicación dentro de la carpeta
“src/components”:
- “src/components/[nombre del directorio]/[nombre del archivo].jsx”
Ejemplo: “src/components/home” y dentro del directorio se crearán los componentes relacionados
con la página de inicio.
Adicionalmente, se deberán introducir todos los recursos que se utilicen dentro del directorio
“src/assets”, dentro del mismo se creará una carpeta por cada página de la aplicación:
- “src/assets/[nombre del directorio]/[nombre del recurso].jpg/png/gif...”
Ejemplo: “src/assets/home/home-banner.jpg”
En el caso de que un recurso o componente tenga un propósito general, se introduce directamente en
el directorio base que se mencionó anteriormente. Si se trata de un recurso sería a “src/assets” y si es
un componente a “src/components”.
4.2. Backend
En relación a la estructura de carpetas que se va a seguir durante el desarrollo del backend, hemos
optado por elegir la estructura que genera automáticamente Django durante su ciclo de vida:
- Una carpeta principal llamada “backend”, que contiene todos los archivos relacionados con el
proyecto.
- La carpeta de configuración llamada “ciao_lavoro”, que contiene los archivos necesarios para la
configuración de la base de datos, las urls, el middleware, etc...
- La carpeta de la API del proyecto llamada “api”, la cual contiene los modelos de base de datos,
las urls, la lógica de negocio, etc...

5. Política de mensajes de commit:
La estructura general de los commits será la siguiente:
- Task [No de tarea] - [Nombre de la tarea] #[No de issue]
Ejemplo: Tarea 13 - Traducción al castellano. #23

En caso de que el cambio arregle una funcionalidad ya existente, se seguirá la siguiente estructura:
- Fix [No de tarea] - [Nombre de la tarea] #[No de issue]
Ejemplo: Fix 14 - Arreglada traducción al castellano. #27

En caso de que el cambio arregle una funcionalidad ya existente y sea un hotfix, se seguirá la siguiente estructura:
- Hotfix [Nº de tarea] - [Nombre de la tarea] #[Nº de issue]
Ejemplo: Hotfix 14 - Arreglada sincronización usuario. #27


Es importante tener en cuenta que cuando se arregle una funcionalidad también será necesario crear su rama
y tarea correspondiente, para más información sobre la ramificación puede consultar el apartado de
Estrategia de ramas. Los commits solo se realizarán en las ramas correspondientes a las tareas o
funcionalidades, que posteriormente pasarán a la rama “develop” para comprobar su funcionalidad y
finalmente a la rama “main”.
El hashtag y el número de la issue es para enlazar la issue al commit y es diferente al número de la tarea.

De forma adicional, se debe  añadir al commit información más detallada si es necesario, siguiendo la siguiente estructura:
- Task [No de tarea] - [Nombre de la tarea] #[No de issue]
-
[Info mas detallada]
Para lograr esto en la tabla de comandos, seria usar “git commit -a” y así podreis escribir mas de una línea.

6. Estándar de código:
Dentro de este proyecto, se van a seguir diferentes estándares para generar código limpio y eficiente, reduciendo así la
deuda técnica.
Para todo el proyecto se programa en Inglés. Aunque la aplicación web se hará en español.
6.1. Frontend
Estándares para React:
● PascalCase: Esta es la convención de nomenclatura más común para los componentes de React Native. Consiste
en poner en mayúscula la primera letra de cada palabra del nombre.
● camelCase: Esta convención de nomenclatura es menos común que PascalCase, pero todavía se usa a veces.
Consiste en poner en mayúscula la primera letra de la primera palabra del nombre y luego poner en mayúscula
la primera letra de cada palabra subsiguiente.
● CONSTANT_CASE: Esta convención de nomenclatura se utiliza para definir constantes y enumeraciones
globales.

Estándares para HTML y CSS:
- Los archivos .css deben tener su nombre en inglés y todas sus letras en minúscula. Si el nombre es una
palabra compuesta, se separa por un guión.
Ejemplo: body, standard-body, white-word-color
- Los nombres de los parámetros dentro de los archivos css deben tener su nombre en inglés y todas sus letras
en minúscula. Si el nombre es una palabra compuesta, se separa por un guión.
Ejemplo: color, background-size, background-size-reel

6.2. Backend
Estándares para Python :

Tipo Convención de nomenclatura Ejemplos
Función Usa una o varias palabras minúsculas. Separe las palabras por

guiones bajos para mejorar la legibilidad.

function,
python_function

Variable Utilice una sola letra, palabra o palabras minúsculas. Separe las

palabras con guiones bajos para mejorar la legibilidad.

x, ,
varpython_variab
le
Clase Comienza cada palabra con una letra mayúscula. No separes las
palabras con guiones bajos. Este estilo se llama estuche camello o
Model,
PythonClass

Style Category
PascalCase component/interface/type/enum/type/para

meters

camelCase variable/parameter/function/method
CONSTANT_CASE global_constant/enum

estuche Pascal.

Método Usa una o varias palabras minúsculas. Separe las palabras con

guiones bajos para mejorar la legibilidad.

class_method,
method

Constante Utilice una sola letra, palabra o palabras mayúsculas. Separe las

palabras con guiones bajos para mejorar la legibilidad.

CONSTANT, ,
PYTHON_CONSTANTP
YTHON_LONG_CONST
ANT
Módulo Usa una o varias palabras cortas y minúsculas. Separe las palabras

con guiones bajos para mejorar la legibilidad.

module.py,
python_module.py

Paquete Usa una o varias palabras cortas y minúsculas. No separes las

palabras con guiones bajos.

package,
pythonpackage

7. Política de versionado:
Seguiremos una metodología clásica para el versionado. Dividiremos la notación de las versiones con la
política X.Y.Z :
-X: Indica cambios mayores, implica ruptura de compatibilidad con versiones anteriores. Si la versión se
encuentra en el desarrollo inicial, la notación será 0.Y.Z.
-Y: Cambios menores, no rompe la compatibilidad con versiones anteriores, incluye nuevas funcionalidades y
mejoras. Puede incluir parches.
-Z: Corrección de errores, no rompe la compatibilidad con versiones anteriores y sólo se usa para cambios
internos de corrección.
Cuando se actualiza el parámetro X, el parámetro Y y el Z se resetean a 0. Cuando se actualiza el parámetro Y,
el parámetro Z se resetea a 0.

8. Política de clockify

Seguiremos la siguiente metodología a la hora de trabajar con clockify:

La descripción de las tareas es la siguiente: Nombre de la Issue en Github, donde “Nombre de la
Issue en Github” será por ejemplo “Task 1 - Despliegue en Google Cloud #32”.

Hay que indicar en el project de la tarea de clockify el sprint y tipo de tarea (desarrollo, documentacion, etc)

La descripción de las clases es la siguiente: Clase ISPP Fecha parte, donde Fecha es la fecha de la clase y parte
es para indicar si ha sido la primera clase o la segunda. Como ejemplo: “Clase ISPP 27/02/2024 primera
parte”.
En el project hay que indicar el tipo de clase que ha sido.

La descripción de las reuniones es la siguiente: Reunión Fecha Sitio Título, donde Fecha es la fecha de la
reunión, sitio es para indicar en donde ha sido la reunión (Discord, CRAI, etc) y Título el título de la reunión
(localizado en el acta de reunión). Como ejemplo: “Reunión 22/02/2024 Discord Dividir tareas y
organización.”
En el project hay que indicar si hemos asistido a la reunión o si únicamente hemos estado leyendo el acta.

La descripción de las theory pills es la siguiente: watch_theory_pill_X, siendo x el título indicado en
enseñanza virtual para la theory pill. Por ejemplo, “watch_theory_pill_Theory Pill on Conflict Management, Effective Demos and
Feedback Management”.
En el project se debe indicar que es una theory pill.

Para Cursos de formación tecnológicos únicamente hay que poner “Curso de Formacion - Elemento” de
descripción, siendo “Elemento” la tecnología de dicho curso escrita en mayúsculas. Por ejemplo, “Curso de
Formacion - DJANGO”. En el project hay que indicar que es un curso de formacion.

9. Política de las Issues
Las issues se estructurará de la siguiente manera:
Para las issues de tareas, se seguirá el siguiente formato de nombre: Task X - Nombre, donde X es el número
de la tarea y Nombre el nombre de la tarea. Por ejemplo, “Task 1 - Despliegue en Google Cloud”.
En la descripción de la issue hay que poner una descripción breve y concisa de la tarea.
En el menú de la derecha, en “Assignees” debe de incluir a las personas responsables de realizar y finalizar
dicha tarea. En “Labels” debe de colocarse el indicador del tipo de tarea (Back End, Front end,
documentacion, fix, despliegue, desarrollo, etc)
Con las issues de fix/arreglos y las de hotfix la estructura y procedimiento es igual, pero en lugar de poner Task se pone Fix o Hotfix.

Además, las Issues se gestionarán de la siguiente forma en el tablero de GitHub:

**Prioridades:**
Indica la cercanía de la tarea respecto al Deadline.
- P0: Una tarea que tiene el Deadline a 4 días o menos
- P1: Una tarea que tiene su Deadline a más de 4 días pero menos de 1 semana
- P2: Una tarea que tiene su Deadline a más de 1 semana

**Size:**
Indica el nivel de complejidad de la tarea (Estimar que cada punto son 30 mins por persona asignada a la tarea):
- XS (1/2): Tareas sencillas, simples o repetitivas
- S (3/4): Tareas con algún tipo de complejidad menor
- M (5/6): Tareas que aportan funcionalidades complejas o requieren de mayor código
- L (7/8): Tareas que requieran de implementación y cambios de otros modelos, o conocimiento de varios para solventarlas
- XL (9/10): Tareas que requieren de trastocar el proyecto entero en su totalidad

**Iteración y fecha:**
En el campo Iteration hay que indicar la iteración a la que corresponde la tarea. Y en el campo “Start Date” y “End Date” hay que poner las fechas de inicio y fin del desarrollo de dicha tarea.

