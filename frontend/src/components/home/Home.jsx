import DescriptionCard from "./DescriptionCard"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import EuroIcon from "../icons/EuroIcon"
import BankNotesIcon from "../icons/BankNotesIcon"
import { Link } from "react-router-dom"
import { useAuthContext } from "../auth/AuthContextProvider"
import useGet from "@/hooks/useGet"
import { BACKEND_URL } from "@/utils/backendApi"
import ServiceCardSkeleton from "../service/ServiceCardSkeleton"
import ServiceCard from "../service/ServiceCard"
import SearchServices from "./SearchServices"

export default function Home() {
   const { loggedUser } = useAuthContext()
   const { data: promotedServices, loading: loadingPromotingServices } = useGet(`${BACKEND_URL}/service/promoted`)
   const { data: popularServices, loading: loadingPopularServices } = useGet(`${BACKEND_URL}/service/rated`)
   console.log()
   return (
      <>
         {loggedUser ? (
            <>
               <h1 className="text-4xl font-bold text-center mt-4 mb-4 lg:mt-10 lg:mb-10">
                  ¡Bienvenido {loggedUser.user.first_name} {loggedUser.user.last_name}!
               </h1>

               <SearchServices />

               <section>
                  <h2 className="text-3xl font-bold text-center mt-4">Servicios promocionados:</h2>
               </section>
               <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5 px-5">
                  {loadingPromotingServices
                     ? [...Array(4)].map((_, index) => <ServiceCardSkeleton key={index} />)
                     : promotedServices.promotedServices
                          .sort((a, b) => new Date(b.is_promoted) - new Date(a.is_promoted))
                          .slice(0, 4)
                          .map(service => <ServiceCard key={service.id} service={service} />)}
               </section>
               <section>
                  <h2 className="text-3xl font-bold text-center">Servicios más populares:</h2>
               </section>
               <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 pb-8 px-5">
                  {loadingPopularServices
                     ? [...Array(4)].map((_, index) => <ServiceCardSkeleton key={index} />)
                     : popularServices.ratedServices
                          .slice(0, 4)
                          .filter(service => service.is_active)
                          .map(service => <ServiceCard key={service.id} service={service} />)}
               </section>
            </>
         ) : (
            <>
               <section>
                  <div className="relative h-[450px] lg:h-[350px] md:h-[350px] overflow-hidden bg-[url('https://www.shutterstock.com/image-photo/professional-office-cleaner-holding-bucket-600nw-588594527.jpg')] bg-cover bg-[50%] bg-no-repeat">
                     <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black/60 bg-fixed">
                        <div className="mx-5 my-5  flex h-full items-center justify-center">
                           <div className="text-center text-white">
                              <h1 className="mb-6 text-5xl font-bold">Bienvenido a CiaoLavoro</h1>
                              <h3 className="mb-4 text-3xl ">Si lo necesitas, lo tenemos!</h3>
                              <h2 className="mb-8 text-2xl ">Si no estas registrado, hazlo y aprovecha nuestros servicios</h2>
                              <Link to="/register">
                                 <button
                                    type="button"
                                    className="inline-block rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-s font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-300 hover:text-neutral-200 focus:border-neutral-300 focus:text-neutral-200 focus:outline-none focus:ring-0 active:border-neutral-300 active:text-neutral-200 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    ¡Registrese!
                                 </button>
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <section className="justify-center grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:px-32 lg:py-6 px-5 py-5">
                  <DescriptionCard icon={<BriefcaseIcon />} title="Encuentre los mejores trabajadores">
                     Descubre una amplia gama de profesionales de diversos campos. Nuestra plataforma te conecta con trabajadores cualificados que
                     están listos para aportar su experiencia a tus necesidades.
                  </DescriptionCard>
                  <DescriptionCard icon={<EuroIcon />} title="Consiga las mejores ofertas">
                     Nos aseguramos de que obtengas el máximo valor por tu dinero. Nuestra plataforma te permite comparar tarifas y elegir servicios
                     que se ajusten a tu presupuesto sin comprometer la calidad.
                  </DescriptionCard>
                  <DescriptionCard icon={<BankNotesIcon />} title="Obtenga dinero fácilmente">
                     ¿Eres un profesional en busca de trabajo? Únete a nuestra plataforma y accede a numerosas oportunidades de trabajo. Establece tus
                     tarifas, elige tus proyectos y comienza a ganar.
                  </DescriptionCard>
               </section>
            </>
         )}
      </>
   )
}
