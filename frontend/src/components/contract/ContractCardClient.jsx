import { handleContractPayment } from "../../api/Contract.api"
import { updateContractStatus, cancelContractStatus } from "../../api/Contract.api"
import { useAuthContext } from "../auth/AuthContextProvider"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
   checkIfPointsMoreThanMoney,
   checkIfPointsPositive,
   checkIfToManyPoints,
   checkIntegerPoints,
   checkNotStringPoints,
   errorMessages,
} from "@/utils/validation"

const contractStatus = {
   negotiation: "Negociacion",
   accepted: "Aceptado",
   inProcess: "En proceso",
   finished: "Finalizado",
   canceled: "Cancelado",
   paid: "Pagado",
}

function getStatusColor(estatus) {
   switch (estatus) {
      case contractStatus.negotiation:
         return "bg-sky-50"
      case contractStatus.accepted:
         return "bg-green-50"
      case contractStatus.inProcess:
         return "bg-yellow-50"
      case contractStatus.finished:
         return "bg-white"
      case contractStatus.canceled:
         return "bg-rose-100"
      case contractStatus.paid:
         return "bg-violet-100"
      default:
         return ""
   }
}

export function ContractCardClient({ contract }) {
   const { loggedUser } = useAuthContext()
   const [tooManyPoints, setTooManyPoints] = useState(false)
   const [positivePoints, setPositivePoints] = useState(false)
   const [noMorePointsMoney, setNoMorePointsMoney] = useState(false)
   const [integerPoints, setIntegerPoints] = useState(false)
   const [notStringPoints, setNotStringPoints] = useState(false)
   const [points, setPoints] = useState(0)
   const [status, setStatus] = useState(contract.estatus)
   const queryParams = new URLSearchParams(window.location.search)

   const resetPaymentErrors = () => {
      setPositivePoints(false)
      setTooManyPoints(false)
      setNoMorePointsMoney(false)
      setNotStringPoints(false)
      setIntegerPoints(false)
   }

   const formatDate = dateString => {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }
      return new Date(dateString).toLocaleDateString(undefined, options)
   }

   const updateStatus = async (contractId, statusNum, sessionId, token) => {
      try {

         const response = await updateContractStatus(contractId, statusNum, sessionId, token)
         if (response.ok && queryParams.get("session_id")) {
            setStatus(contractStatus.paid)
         } else if (response.ok) {
            window.location.reload()
         } else {
            alert("Error al actualizar el estado. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Error al actualizar el estado. Por favor, intente de nuevo.")
      }
   }

   const handlePayment = async (contractId, token, points1) => {
      const returnURL = window.location.href
      const money = contract.cost
      if (checkIfToManyPoints(contract.client.points, points1)) {
         setTooManyPoints(true)
         return
      } else if (checkIfPointsPositive(points1)) {
         resetPaymentErrors()
         setPositivePoints(true)
         return
      } else if (checkIfPointsMoreThanMoney(points1, money)) {
         resetPaymentErrors()
         setNoMorePointsMoney(true)
         return
      } else if (checkIntegerPoints(points1)) {
         resetPaymentErrors()
         setIntegerPoints(true)
         return
      } else if (checkNotStringPoints(points1)) {
         resetPaymentErrors()
         setNotStringPoints(true)
         return
      }
      resetPaymentErrors()

      try {
         const responseData = await handleContractPayment(contractId, token, returnURL, points1)
         const sessionUrl = responseData.sessionUrl
         if (sessionUrl) {
            window.open(sessionUrl, "_self")
         } else {
            alert("Error al obtener la URL de pago. Por favor, inténtelo de nuevo.")
         }
      } catch (error) {
         alert("Error al procesar la operación. Por favor, inténtelo de nuevo.")
      }
   }

   const cancelContract = async (contractId, cancelationDescription, token) => {
      try {
         const response = await cancelContractStatus(contractId, cancelationDescription, token)
         if (response.ok) {
            const refund = (await response.json()).refund
            if (refund === "0") {
               alert("No se reembolsará el importe pagado")
            } else {
               alert("Se devolvera " + refund + "€")
            }
            setStatus(contractStatus.canceled)
            window.location.reload()
         } else {
            alert("Error al actualizar el estado. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Error al actualizar el estado. Por favor, intente de nuevo.")
      }
   }

   useEffect(() => {
      if (status === "Aceptado" && queryParams.get("session_id") && +queryParams.get("contract_id")===contract.id) {
         updateStatus(contract.id, 6, queryParams.get("session_id"), loggedUser.token)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <a>
         <div className={`max-w-md mx-auto my-2 border rounded-lg overflow-hidden p-6 ${getStatusColor(status)}`}>
            <h2 className="text-2xl font-semibold text-center">Nombre del trabajador:</h2>
            <p className="mb-2 mt-1 text-2xl text-center">
               <strong>{contract.worker.username}</strong>
            </p>
            <p className="mb-2">
               <strong>Fecha de inicio:</strong> {formatDate(contract.initial_date)}
            </p>
            <p className="mb-2">
               <strong>Fecha fin:</strong> {formatDate(contract.end_date)}
            </p>
            <p className={"mb-2"}>
               <strong>Estado:</strong> {status}
            </p>
            <p className="mb-2">
               <strong>Remuneración a recibir:</strong> {contract.cost}€
            </p>
            <p className="mb-2">
               <strong>Descripción del contrato:</strong> {contract.description}
            </p>
            {status === "Cancelado" && (
               <p className="mb-2">
                  <strong>Motivo de cancelación:</strong> {contract.description_cancelation}
               </p>
            )}

            <div className="flex justify-center items-center">
               {contract.estatus === "En proceso" && (
                  <button
                     className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 self-center"
                     onClick={() => updateStatus(contract.id, 4, '', loggedUser.token)}>
                     Trabajo terminado
                  </button>
               )}
            </div>

            <div className="flex justify-center">
               {status === "Aceptado" && (
                  <div className="pt-4">
                     {contract.client.points === 0 ? (
                        <button
                           className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
                           onClick={() => handlePayment(contract.id, loggedUser.token, Number(points))}>
                           Pagar Contrato
                        </button>
                     ) : (
                        <Dialog>
                           <DialogTrigger asChild>
                              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4">
                                 Pagar Contrato
                              </button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                 <DialogTitle>¿Cuantos puntos quieres usar para pagar?</DialogTitle>
                                 <DialogDescription>Los puntos descontarán dinero del precio final.</DialogDescription>
                                 <DialogDescription>
                                    <strong>Tus puntos:</strong> {contract.client.points}
                                 </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                 <div className="grid grid-col-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                                    <Label htmlFor="name" className="text-left">
                                       Puntos
                                    </Label>
                                    <Input id="points" value={points} onChange={e => setPoints(e.target.value)} className="col-span-3" />
                                 </div>
                                 <DialogDescription>
                                    {(tooManyPoints || positivePoints || noMorePointsMoney || notStringPoints || integerPoints) && (
                                       <div className="text-red-500">
                                          {(tooManyPoints && errorMessages.tooManyPoints) ||
                                             (positivePoints && errorMessages.positivePoints) ||
                                             (noMorePointsMoney && errorMessages.noMorePointsMoney) ||
                                             (notStringPoints && errorMessages.notCorrectPoitns) ||
                                             (integerPoints && errorMessages.notIntegerPoints)}
                                       </div>
                                    )}
                                 </DialogDescription>
                                 <DialogFooter>
                                    <button
                                       className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
                                       onClick={() => handlePayment(contract.id, loggedUser.token, Number(points))}>
                                       Pagar
                                    </button>
                                 </DialogFooter>
                              </div>
                           </DialogContent>
                        </Dialog>
                     )}
                  </div>
               )}
            </div>
            <div className="flex justify-center items-center">
               {(status === "Negociacion" || status === "Aceptado" || status === "Pagado") && (
                  <button
                     className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-4"
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
            </div>
         </div>
      </a>
   )
}
