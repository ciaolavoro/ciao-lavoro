# Recopilación del Feedback de los usuarios Piloto Sprint 3

## CIAOLAVORO
**Grupo 6**
**Entregable: Sprint 3**

## Miembros del equipo y contribución

| Nombre y Apellidos | Tipo de Contribución |
|---------------------|-----------------------|
| Adrián García Chavero     |  Redacción      |
| Alexander / Alicia Sánchez Hossdorf     |  Revisión      |

---

### CONTROL DE VERSIONES
| FECHA      | VERSIÓN | DESCRIPCIÓN                                    |
|------------|---------|------------------------------------------------|
| 15/04/2024 | 1.0     | Creación del documento y redacción del feedback|
| 16/04/2024 | 1.1     | Finalización del feedback                      |

---

## TÉRMINOS Y CONDICIONES

- Revisar nuevamente si existen claúsulas abusivas.
- En los términos indica que la edad mínima es 13 años, mientras que en la aplicación son 16 años. Cambiarlo en los términos.
- Mejorar visualmente el documento de términos.

## INICIO DE SESIÓN

- Cambiar las credenciales del administrador.

## REGISTRO DE USUARIO

- Comprobar que el correo se verifique y exista.
- Revisar si existen errores de validación que no se están teniendo en cuenta.
- Quitar los alert para los errores de validación y hacerlo como se realiza en editar perfil por ejemplo.

## EDICIÓN DE USUARIO

- Comprobar que el correo se verifique y exista.
- Revisar la posibilidad de editar el perfil sin cerrar sesión.
- Revisar por qué aparece el error de la fecha de nacimiento con la fecha 10/04/2002.

## SERVICIOS

- Poner una tilde en profesión en la búsqueda de servicios.
- Mejorar mensaje de error de la experiencia al crear/editar un servicio. Indicar cuanto es el mínimo de años de experiencia en relación a tu edad.
- Al promocionar un servicio, da un error al poner 0 puntos o puntos decimales. También deja poner -0 puntos y valores no númericos.
- Si no tienes puntos, que no aparezca el modal para indicar cuantos puntos usar para el descuento.
- Revisar si al crear un servicio, da un error de que ya existe el servicio.
- Añadir un [tooltip](https://ui.shadcn.com/docs/components/tooltip) en el icono del megáfono indicando que se trata de un servicio promocionado.
- Si se pone la experiencia en decimales al crear/editar un servicio da un error.
- Revisar que la pasarela de pago de promoción funcione correctamente.
- Cuando creas más de un servicio, aparece un error indicando que no se puede crear un servicio con la misma profesión, aunque no sea la misma profesión.
- Cuando no se encuentran servicios con los filtros aplicados, que muestre un mensaje de que no se encuentra ningún servicio. Similar a como se hace en contratos.
- Las estrellas de las reseñas se salen de la pantalla en móvil.
- Al introducir un texto muy largo al crear/editar un servicio, se llega a salir de la pantalla en los detalles.

## TRABAJOS

- Poner un mínimo de caracteres en el nombre.
- Al crear/editar un trabajo, se puede introducir un precio de 0.0 al introducir 0.00000001.
- Revisar si deja poner decimales al crear/editar un trabajo.

## CONTRATOS

- No deja poner decimales en la creación de contrato.
- Revisar si la búsqueda de contratos funciona correctamente.
- Es posible crear un contrato que inicie dentro de 1000 años y dura 10 años. Realizar validaciones más estrictas.
- Revisar si es posible crear un contrato con fecha anterior a la actual.
- Si no tienes puntos, que no aparezca el modal para indicar cuantos puntos usar para el descuento.
- Revisar si existe algún error al indicar un contrato como terminado.
- Al pagar un contrato, da un error al poner 0 puntos o puntos decimales. También deja poner -0 puntos y valores no númericos.
- Revisar si es posible cancelar un contrato.
- Si tengo más de un contrato con un trabajador, al pagar uno de los contratos se paga automáticamente el otro. Revisar si está relacionado con los estados de los contratos.

## DESPLIEGUE

- Las imagenes no aparecen porque se reinicia el Backend. Buscar un hosting distinto o revisar si se pueden alojar las imagenes en un servidor externo (ej. Google Drive o Dropbox), y utilizar su API para obtener dichas imágenes.
