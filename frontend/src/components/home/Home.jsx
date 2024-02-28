import DescriptionCard from "./DescriptionCard";
import BriefcaseIcon from "../icons/BriefcaseIcon";
import EuroIcon from "../icons/EuroIcon";
import BankNotesIcon from "../icons/BankNotesIcon";

export default function Home() {

  return (
    <>
      <section>
        <form className="flex justify-center gap-2 my-4">
          <input type="text" placeholder="Buscar servicios de trabajadores" className="w-96 pl-2 border rounded" />
          <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Buscar</button>
        </form>
        <img src="./src/assets/home/home-banner.jpg" alt="Banner de la página de inicio" className="w-full h-[390px] px-28 object-cover" />
      </section>
      <section className="flex justify-center gap-4 px-32 py-6">
        <DescriptionCard icon={<BriefcaseIcon />} title="Encuentre los mejores trabajadores">
          Descubre una amplia gama de profesionales de diversos campos.
          Nuestra plataforma te conecta con trabajadores cualificados que están listos para aportar su experiencia a tus necesidades.
        </DescriptionCard>
        <DescriptionCard icon={<EuroIcon />} title="Consiga las mejores ofertas">
          Nos aseguramos de que obtengas el máximo valor por tu dinero.
          Nuestra plataforma te permite comparar tarifas y elegir servicios que se ajusten a tu presupuesto sin comprometer la calidad.
        </DescriptionCard>
        <DescriptionCard icon={<BankNotesIcon />} title="Obtenga dinero fácilmente">
          ¿Eres un profesional en busca de trabajo? Únete a nuestra plataforma y accede a numerosas oportunidades de trabajo.
          Establece tus tarifas, elige tus proyectos y comienza a ganar.
        </DescriptionCard>
      </section>
    </>
  )
}
