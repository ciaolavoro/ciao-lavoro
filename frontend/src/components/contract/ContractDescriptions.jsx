import Accordion from "./Accordion"

export default function ContractDescriptions() {
   return (
      <section className="px-5 lg:px-80 md:px-30 sm:px-20 py-6 ">
         <div className="p-4 bg-white rounded-lg divide-y-2">
            <Accordion
               title="¿Cuántos estados hay?"
               answer={`
                        En total hay 6 estados:

                        - Negociación: el contrato se ha creado, y esta pendiente de que el trabajador lo acepte o deniegue.
                        - Aceptado: el contrato ha sido aceptado por el trabajador y el cliente debe realizar el pago.
                        - Cancelado: El contrato ha sido cancelado por el trabajador. 
                        - Pagado: el pago ha sido realizado. Solo falta esperar a que llegue el momento de realizar el trabajo.
                        - En proceso: el trabajador debe indicar que ya ha comenzado a realizar el trabajo para el cual se le habia contactado.
                        - Finalizado: una vez el trabajo ha sido acabado, el cliente debe marcar como finalizado el contrato.`}
            />

            <Accordion
               title="¿Que significan los colores?"
               answer={`
                        Dependiendo del estado en el que se encuentre el contrato, aparecerá como un color u otro para que sea más fácil de 
                        reconocer:

                        - Negociación: azul.
                        - Aceptado: verde.
                        - Cancelado: rojo. 
                        - Pagado: violeta.
                        - En proceso: amarillo.
                        - Finalizado: blanco.`}
            />

            <Accordion
               title="¿Como funcionan los botones?"
               answer={`
                        Teniendo en cuenta la explicación que damos sobre los estados en el primer apartado, hay que tener en 
                        cuenta las siguientes cosas:
                        
                        - Negociación: si esta en estado de negociación, solo el trabajador podra aceptaro o denegarlo.
                        - Aceptado: una vez aceptado, aparecera un boton para pagar al cliente. Hasta que no se pague no se pondrá en 
                        marcha el trabajo llegado el día.
                        - Pagado: si se encuentra en estado de pagado, cuando llegue el dia, el trabajador deberá marcar que se ha comenzado 
                        el trabajo para que pase a estar en proceso. 
                        - En proceso: si el contrato no se encuentra en estado de En proceso, no se podrá finalizar. 
                        - Finalizado: solo el cliente podrá finalizar una vez esté el trabajo terminado.`}
            />
         </div>
      </section>
   )
}
