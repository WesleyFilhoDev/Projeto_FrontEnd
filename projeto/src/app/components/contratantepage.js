import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import VacancyCard from "./vacancycard";

export default function ContratantePage() {
  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-10 max-w-md mx-auto font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-6">
        {/* Topo */}
        <div className="flex justify-between items-center">
          <Image src="/logopages.png" alt="Logo" width={150} height={40} />
          <Image
            src="/user.png"
            alt="Usuário"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>

        {/* Saudação */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">Olá,</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Quem você está <br />
            <span className="text-indigo-800">procurando?</span>
          </h1>
        </div>

        {/* Vagas publicadas + botão */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Vagas publicadas:</p>
          <button className="flex items-center gap-1 bg-purple-600 text-white text-sm px-3 py-1.5 rounded-full">
            Adicionar <FiPlus size={14} />
          </button>
        </div>

        {/* Lista de cards */}
        <div className="mt-4 space-y-4">
          <VacancyCard
            image="/barista.png"
            title="Barista"
            location="Espinheiro, Recife"
            buttonLabel="Exibir Candidatos"
          />
          <VacancyCard
            image="/atendente.png"
            title="Atendente"
            location="Boa Viagem, Recife"
            buttonLabel="Exibir Candidatos"
          />
        </div>
      </div>
    </div>
  );
}
