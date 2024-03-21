![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.001.png)

|**ACTAS DE REUNIÓN**||
| :- | :- |
|REUNIÓN DEL GRUPO 6 - ISPP||
|**Título de la reunión**:|Organización Sprint 2.|
|**Fecha:**|05 de marzo de 2024|
|**Hora inicio – hora fin**: |16:50 am – 19:00 am |
|**Lugar de Celebración:**|Reunión In Situ (CRAI).|
|**Encargado**: |Alexander | Alicia Sánchez Hossdorf|

# **ASISTENTES**

|**Nombre de los Asistentes**|**Iniciales**|**Presente**|**UVUS**|
| :- | :- | :- | :- |
|Adrián García Chavero|AGC|☒|Adrgarcha|
|Alexander | Alicia Sánchez Hossdorf|ASH|☒|Alisanhos|
|Álvaro Hidalgo Rodríguez|AHR|☒|alvhidrod|
|Antonio Barea Jiménez|ABJ|☒|Antbarjim1|
|Diego González Quintanilla|DGQ||diegonqui|
|Francisco Antonio Campos Campos|FCC|☒|Fracamcam|
|Javier Grosso de Terrero Gómez|JGG||Javgrogom|
|Joaquín Arregui Díaz|JAD|☒|Joaarrdia|
|José Luis Cobo Ariza|JCA|☒|Joscobari|
|Pablo Cuenca Pérez|PCP|☒|Pabcueper|
|Pablo Mateos Angulo|PMA|☒|Pabmatang|
|Samuel Albalat Ortiz|SAO||samalbort|

# **APROBACIÓN DE LAS ACTAS**
Se leyeron las actas al finalizar la reunión y todos estaban de acuerdo.


#
# **AGENDA DE LA REUNIÓN**
- - <a name="_hlk160561733"></a>Feedback dado por los profesores
- - Documentación como código. 
- - Revisar el Sprint 1.
- - Nueva repartición de equipo.
- - División de tareas S2
- - Deadlines de las tareas. 
# **RESUMEN DE LA REUNIÓN**

1. **Feedback dado por los profesores.**

Se debe revisar el TCO dado que esta mal. Le hemos pedido a los compañeros del grupo de Cohabify que nos enseñen como lo han hecho para realizarlo bien. 

El drive debemos organizarlo ya que esta hecho un caos. 

El resto de las cosas viene bien explicado en el FeedbacK. Todos debéis leéroslo y tenerlo en cuenta, aunque la gran mayoría de cosas han sido respecto al TCO, Rendimiento y diapositivas. 

1. **Documentación como código.**

Se ha decidido que la documentación como código lo haremos de la siguiente forma:

Se creará una carpeta dentro del repositorio de CiaoLavoro que se llame Docs, en el cual comenzaremos a meter todo en formato markdown. 

A Carlos Muller le gusta tener todo en un solo repositorio y que todo este bien organizado. 

Como dijo Muller, no hace falta que metamos todo lo que teníamos antes, podemos hacerlo poco a poco. Lo importante es que a partir de ahora TODO lo vayamos subiendo ahí. 

1. **Revisar Sprint 1.**
- Cambiar colores a los botones. 
- Ver porque la base de datos no es persistente.
- Tal vez podamos intentar desplegar en **PythonAnyWhere**, en vez de en render.
- Ver porque al recargar la pagina da un error 500. 
- Revisar todas las **restricciones**, deben estar tanto en back-end como front-end.
- Hacer que la pagina sea **responsive**. 
- ¡¡Hacer testing!!

1. **Nueva repartición de equipo.**

Para un mejor trabajo en equipo, que haya una mejora de comunicación, se ha decidido dividir el grupo en **3 equipos** de trabajo. En cada equipo habrá dos miembros de backend y dos de frontend. 

Así, cuando se le asigne un área de trabajo a ese equipo, backend y frontend podrá estar en contacto y trabajar de forma mas eficiente. Trabajando ambos a la vez y no atrasar así las tareas. 




Los siguientes equipos son:

- **Equipo 1**:
  - Backend: Álvaro Hidalgo y Samuel Albalat.
  - Frontend: Pablo Cuenca y Alex Sánchez.
- **Equipo 2:** 
  - Backend: José Luis Cobo y Joaquín Arregui.
  - Frontend: Francisco Antonio Campos y Javier Grosso.
- **Equipo 3:** 
  - Backend: Diego González y Antonio Barea.
  - Frontend: Pablo Mateos y Adrián García.

1. **División de tareas S2**

![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.002.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.003.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.004.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.005.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.006.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.007.png)![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.008.jpeg)

Se han dividido las tareas teniendo en cuenta las entidades: Usuario, Servicio, Trabajos, Contrato, Tarea, Pago y Reviews. 

Después según prioridad, hemos dividido en tres lotes, según el orden de cómo debemos hacerlo:

**1º (rojo)-** Usuario, Servicio y Jobs. 

**2º (azul)-** Contrato y Tareas

**3º (verde)-** Pagos y reviews. (tened en cuenta que aquí hay menos carga, pero porque deberemos hacer documentación y despliegue). 




Tras esto tenemos las siguientes tareas, a las cuales se les ha asignado sus respectivos equipos: 

**1º lote (rojo)**

- Usuario:


  - ![](Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.009.png)![ref1]Arreglar log-in.
  - Registro (¡¡Tened en cuenta las validaciones!!)
  - Añadir foto al modelo


  - ![ref2]![ref3]Detalle de perfil.
  - Editar perfil. (¡¡Tened en cuenta las validaciones!!)
- Trabajos


  - ![ref4]![ref3]Crear modelo
  - CRUD (sin detalle del trabajo)
    - (A tener en cuenta la relación con servicio y validaciones)
- Servicio


  - ![ref5]![ref3]Arreglar el crear (coger el ID del usuario logeado y completar con más información. ¡¡Tened en cuenta las validaciones!!)


  - ![ref4]![ref1]Listar los servicios filtrándolo por ciudad o profesión (para que los clientes puedan buscar los servicios que necesiten)
  - Listar los servicios propios del usuario logeado (para que un trabajador pueda acceder a sus servicios)


  - ![ref2]![ref3]Detalle del servicio (junto a sus trabajos).
  - Editar el servicio (desactivar) 

**2º lote (azul)**

- Contrato:


  - ![ref4]![ref3]Listar los contratos según el usuario logueado. 


  - ![ref5]![ref3]Filtrar el listado según fecha o estado (los finalizados no mostrarlos, pero que se pueda acceder desde un desplegable o botón)
  - Arreglar el crear contrato. (Que se acceda desde servicio, asociando directamente la ID de dicho servicio al contrato, tema de los ID del worker y cliente, fechas. 
- Tarea: 


  - ![ref2]![ref1]CRU(D)<sup>2</sup> : la d elevado a dos significa que debemos incluir los detalles de las tareas. 
  - Tener en cuenta que el tema de las tareas se hace al crear un contrato. Ahí podemos seleccionar las tareas asociadas a un servicio y añadir cuantas queramos. Así el precio se calcula solo. Por ej.: Si quiero que un fontanero me cambie 1 grifo (10€) y me arregle dos tuberías (15€/ud). Añado 3 tareas: una colocación de grifo + dos reparaciones de tuberías = 40€. 

**3º lote (verde)**. Ya se verá mas tarde. 

- Pago
- Review










1. **Deadline de las tareas.** 

Teniendo en cuenta esto, y que tenemos desde el 6 hasta el 21 de marzo para realizar el desarrollo, ya que el 21 debemos entregarle le producto a los usuarios pilotos, las deadlines según los lotes que hemos hechos serán los siguientes:

**1º (rojo)-** Backend: viernes 08/03. Frontend: domingo 10/03. 

**2º (azul)-** Backend: jueves 14/03. Frontend: domingo 17/03.

**3º (verde)-** Backend: lunes 18/03. Frontend:  miércoles 20/03.

Así tendremos margen para poder realizar el despliegue. Teniendo en cuenta que las tareas del 3º lotes son mas ligeras de carga. 

¡¡NO OLVIDAR!! aunque las deadlines de backend y frontend sean diferentes, lo mejor es trabajar juntos y a la vez. Para que, si frontend necesite algo, lo pueda pedir a backend y enseguida se ponga en ello, sin que haya mucho tiempo de diferencia. 

# **TAREAS A REALIZAR.** 
Las tareas se pondrán en el Git Project.  

[ref1]: Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.010.png
[ref2]: Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.011.png
[ref3]: Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.012.png
[ref4]: Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.013.png
[ref5]: Aspose.Words.6293beb7-87f7-4f94-81a2-5cafc9eea5a5.014.png
