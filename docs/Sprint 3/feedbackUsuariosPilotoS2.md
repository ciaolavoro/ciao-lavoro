# CLIENTES
- Mejorar el diseño de usuario
- Poder cancelar Contrato (aunque sea con alguna cláusula)
- Comunicación entre contratos
- Se cierra al modificar datos de usuario.
- No se pueden poner decimales al establecer el precio del trabajo
- Botón de editar trabajo en servicios que no son del usuario
- Error en la pasarela de pago: No ha funcionado en alguna ocasión tras pagar: el estado del contrato seguia en pagar
- Error al recargar la página

# GRUPO 12

- Problemas con registro de usuario

Deberia ser obligatorio aceptar el customer agreement (creo que esto está hecho).

Al registrarse y editar perfil permite subir archivos que no son imagenes. Además, en el apartado de perfil de usuario no se aprecia la imagen al completo. 

El campo idioma es un campo de texto: proponen hacerlo seleccionable y además que sea algo que escoges tambien al registrarte, no solo al editar perfil.

Recomendación: Que la confirmación de contraseña en el registro tenga también la opción de poder verla.

Al crear una cuenta y poner algo parecido a correo@mail no dice en que falla y la pagina devuelve un error.

Recomendación: Meter usuarios destacados (A revisar por el equipo).

En las contraseñas se debe especificar que valores permite el sistema para que no haya errores.

He introducido la fecha 28/02/2031 y al pulsar en guardar cambios, ha saltado un error. Se debería contemplar mediante validaciones los datos que se introducen para actualizar el perfil, al igual que se hace en el registro. (A revisar por el equipo)

La información del usuario se guarda en el local storage, esto puede ser un fallo de seguridad importante, aparece hasta la contraseña encriptada.

Al actualizar el perfil se cierra la sesión.


- Problemas con los servicios

En el apartado Ciudad de la creación de un servicio no permite meter espacios ni tampoco la ñ, por lo que localizaciones como "Castilla la mancha" o "Logroño" no se pueden meter.

Validar que la ciudad existe (A revisar por el equipo).

Al buscar servicios por una ciudad, si se le da a intro, se reinicia.

Se imprimen más cosas de la cuenta por consola (No se si es mucho problema este)

Recomendación: Puede ser util buscar por usuario.

Si no se está loggeado, aparece el texto "Servicios más populares:", pero no aparece nada.

Se puede quitar el check de activo sin primero darle a editar, entonces no se guarda el cambio.





- Problemas con los trabajos

En creación de un trabajo si se pone un precio muy alto  o un nombre muy grande o en el nombre pones todo numeros salta un "error fetching the resource".

Si el precio tiene decimales salta un error (se podria especificar que solo se puedan puedan enteros)

Creación de trabajo: se puede añadir un maximo al precio de los trabajos (A revisar por el equipo).

Cuando editas un trabajo desaparece del listado principal.

En trabajos poder especificar el formato de pago, ya sea € o €/h.

Especificar que la experiencia es en años.






- Problemas con los contratos y pasarela de pago

La validación de la fecha tiene un mensaje en inglés, además se puede crear un contrato de 1 minuto.

Si se pone todo números da error en crear contraro.

Cuando se ha pagado el contrato no se ha modificado el estado y ha tenido que pagar 2 veces para que se modifique.

Si el precio tiene decimales salta un error (se podria especificar que solo se puedan puedan enteros)

Dentro de la creación de un contrato, se rompe la vista del formulario.

Recomendación: Estaría bien que en la hora también se desplegara un item interactivo.




- Problemas con las reviews







- Problemas con la interfaz grafica

En interfaces reducidas se sale los campos del fondo blanco en varios formularios y vistas.

La interfaz creación de contrato no es responsive.

Corregir errores ortográficos.

Aparecen botones que solo deben aparecer a los usuarios si eres el dueño o no de las cosas.


- Problemas de otro tipo

Añadir en la landing page enlaces que lleven a los desplegables de las diferentes iteraciones de la aplicación.

Recomendación: Mostrar errores en rojo en los campos donde se encuentra el error en vez de pop ups.