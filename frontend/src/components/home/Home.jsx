import Navbar from "../Navbar";
import Background from "../Background";
import DescriptionCard from "./DescriptionCard";
import BriefcaseIcon from "../icons/BriefcaseIcon";
import EuroIcon from "../icons/EuroIcon";
import BankNotesIcon from "../icons/BankNotesIcon";
import WorkerCard from "./WorkerCard";

export default function Home() {

  const professions = [
    {
      id: 1,
      name: "Carpintero",
    },
    {
      id: 3,
      name: "Abogado",
    },
    {
      id: 4,
      name: "Diseñador",
    },
    {
      id: 5,
      name: "Programador",
    },
  ];

  const workers = [
    {
      id: 1,
      name: "Juan Manuel",
      profession: "Carpintero",
      salaryPerHour: 6.5,
      profileImg: "./src/assets/home/juan-manuel.jpg"
    },
    {
      id: 2,
      name: "Marta Cruz",
      profession: "Abogada",
      salaryPerHour: 11, 
      profileImg: "./src/assets/home/marta-cruz.jpg"
    },
    {
      id: 3,
      name: "José Luis",
      profession: "Programador",
      salaryPerHour: 8.5, 
      profileImg: "./src/assets/home/jose-luis.jpg"
    },
    {
      id: 4,
      name: "María José",
      profession: "Diseñadora",
      salaryPerHour: 7.5,
      profileImg: "./src/assets/home/maria-jose.jpg"
    }
  ];

  return (
    <div className="relative font-sans">
      <Navbar />
      <Background />
      <main className="h-screen">
        <section>
          <img src="./src/assets/home/home-banner.jpg" alt="Banner de la página de inicio" className="w-full h-[500px] px-28 object-cover" />
          <form className="flex justify-center gap-2 my-4">
            <input type="text" placeholder="Buscar trabajador" className="pl-2 border rounded" />
            <select className="px-2 py-1 rounded">
              {professions.map((profession) => (
                <option key={profession.id} value={profession.id}>{profession.name}</option>
              ))}
            </select>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Buscar</button>
          </form>
        </section>
        <section className="flex justify-center gap-4 px-32">
          <DescriptionCard icon={<BriefcaseIcon />} title="Encuentre los mejores trabajadores">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dignissimos quod officiis temporibus, dolor facere, ipsa magnam quasi
            sunt sed expedita officia doloribus ipsum nulla optio quia numquam vel veritatis!
          </DescriptionCard>
          <DescriptionCard icon={<EuroIcon />} title="Consiga las mejores ofertas">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dignissimos quod officiis temporibus, dolor facere, ipsa magnam quasi
            sunt sed expedita officia doloribus ipsum nulla optio quia numquam vel veritatis!
          </DescriptionCard>
          <DescriptionCard icon={<BankNotesIcon />} title="Obtenga dinero fácilmente">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni dignissimos quod officiis temporibus, dolor facere, ipsa magnam quasi
            sunt sed expedita officia doloribus ipsum nulla optio quia numquam vel veritatis!
          </DescriptionCard>
        </section>
        <section className="px-32 my-6">
          <h3 className="mb-3 font-bold">Trabajadores populares</h3>
          <ul className="flex justify-center gap-4">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
