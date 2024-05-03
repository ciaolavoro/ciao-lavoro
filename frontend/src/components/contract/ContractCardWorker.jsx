import { updateContractStatus, cancelContractStatus } from "../../api/Contract.api"
import { useAuthContext } from "../auth/AuthContextProvider"

export function ContractCardWorker({ contract }) {
   const { loggedUser } = useAuthContext()

   const formatDate = dateString => {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }
      return new Date(dateString).toLocaleDateString(undefined, options)
   }

   function getStatusColor(status) {
      switch (status) {
         case "Negociacion":
            return "bg-sky-50"
         case "Aceptado":
            return "bg-green-50"
         case "En proceso":
            return "bg-yellow-50"
         case "Finalizado":
            return "bg-white"
         case "Cancelado":
            return "bg-rose-100"
         case "Pagado":
            return "bg-violet-100"
         default:
            return ""
      }
   }

   const updateStatus = async (contractId, statusNum, token) => {
      try {
         const response = await updateContractStatus(contractId, statusNum, '', token)
         if (response.ok) {
            window.location.reload()
         } else {
            alert("Error al actualizar el estado. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Error al actualizar el estado. Por favor, intente de nuevo.")
      }
   }
   const cancelContract = async (contractId, cancelationDescription, token) => {
      try {
         const response = await cancelContractStatus(contractId, cancelationDescription, token)
         if (response.ok) {
            alert("Estado actualizado correctamente")
            const refund = (await response.json()).refund
            if (refund === "0") {
               alert("No se devolvera el importe")
            } else {
               alert("Se devolvera " + refund + "€")
            }
            window.location.reload()
         } else {
            alert("Error al actualizar el estado. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Error al actualizar el estado. Por favor, intente de nuevo.")
      }
   }

   return (
      <div className={`max-w-md mx-auto my-2 border rounded-lg overflow-hidden p-6 ${getStatusColor(contract.estatus)}`}>
         <h2 className="text-2xl text-center font-semibold">Nombre del cliente:</h2>
         <p className="mb-2 mt-1 text-2xl text-center">
            <strong>{contract.client.username}</strong>
         </p>
         <p className="mb-2">
            <strong>Fecha de inicio:</strong> {formatDate(contract.initial_date)}
         </p>
         <p className="mb-2">
            <strong>Fecha fin:</strong> {formatDate(contract.end_date)}
         </p>
         <p className="mb-2">
            <strong>Estado:</strong> <span className={`${getStatusColor(contract.estatus)}`}>{contract.estatus}</span>
         </p>
         <p className="mb-2">
            <strong>Remuneración a recibir:</strong> {contract.cost}€
         </p>
         <p className="mb-2">
            <strong>Descripción del contrato:</strong> {contract.description}
         </p>
         {contract.estatus === "Cancelado" && (
            <p className="mb-2">
               <strong>Motivo de cancelación:</strong> {contract.description_cancelation}
            </p>
         )}

         {contract.estatus === "Negociacion" && (
            <button
               className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 mr-3"
               onClick={() => updateStatus(contract.id, 2, loggedUser.token)}>
               Aceptar Contrato
            </button>
         )}

         {(contract.estatus === "Negociacion" || contract.estatus === "Aceptado" || contract.estatus === "Pagado") && (
            <button
               className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-4 mr-3"
               onClick={() => {
                  let cancelationDescription = prompt("Por favor, introduzca un motivo para la cancelación: (Obligatorio)")
                  while (cancelationDescription !== null && !cancelationDescription.trim()) {
                     cancelationDescription = prompt(
                        "La descripción de la cancelación es obligatoria y no puede estar vacía. Por favor, introduzca un motivo para la cancelación:"
                     )
                  }
                  if (cancelationDescription !== null) {
                     cancelContract(contract.id, cancelationDescription, loggedUser.token)
                  } else {
                     return
                  }
               }}>
               Cancelar Trabajo
            </button>
         )}

         {contract.estatus === "Pagado" && (
            <button
               className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 "
               onClick={() => updateStatus(contract.id, 3, loggedUser.token)}>
               Comenzar trabajo
            </button>
         )}

         
      </div>
   )
}
