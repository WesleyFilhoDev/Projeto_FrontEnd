"use client";
import Image from "next/image";
import VacancyCard from "./vacancycard";

export default function VacancyPage() {
  const vacancies = [
    {
      id: 1,
      title: "Barista",
      location: "Espinheiro, Recife",
      image: "/eletricista.jpg",
    },
    {
      id: 2,
      title: "Atendente",
      location: "Boa Viagem, Recife",
      image: "/eletricista.jpg",
    },
  ];

  function handleDesistir(id) {
    console.log(`Desistiu da vaga ${id}`);
    // Lógica
  }

  return (
    <main className="min-h-screen bg-white px-4 pt-6 pb-10 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="">
            <Image src="/logopages.png" alt="logo" width={150} height={40} />
          </div>
        </div>
        <Image
          src="/user.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>

      {/* Título e subtítulo */}
      <h1 className="text-2xl font-bold text-[#0A1D56] mb-1">Minhas vagas</h1>
      <p className="text-gray-600 text-base mb-4">Vagas aplicadas:</p>

      {/* Lista de Vagas usando VacancyCard */}
      <div className="flex flex-col gap-4">
        {vacancies.map((vaga) => (
          <VacancyCard
            key={vaga.id}
            image={vaga.image}
            title={vaga.title}
            location={vaga.location}
            buttonLabel="Desistir"
            onButtonClick={() => handleDesistir(vaga.id)}
          />
        ))}
      </div>
    </main>
  );
}
