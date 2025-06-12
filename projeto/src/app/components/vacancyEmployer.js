"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // Importamos useState e useEffect
import Link from "next/link"; // 1. Importamos o Link para a navegação
import Parse from "../services/back4app"; // Importamos a conexão
import { useRouter } from "next/navigation";

export default function VacancyEmployer() {
  const router = useRouter();
  // 2. Criamos estados para guardar as vagas e controlar o carregamento
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // 3. useEffect para buscar os dados do Back4App quando a página carrega
  useEffect(() => {
    const fetchVacancies = async () => {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        router.push("/employer-login"); // Garante que apenas usuários logados acessem
        return;
      }
      setUserName(currentUser.get("name"));

      try {
        const Employer = Parse.Object.extend("Employer");
        const employerQuery = new Parse.Query(Employer);
        employerQuery.equalTo("user", currentUser);
        const employerProfile = await employerQuery.first();

        if (employerProfile) {
          const Vacancy = Parse.Object.extend("AvailableVacancy");
          const vacancyQuery = new Parse.Query(Vacancy);
          vacancyQuery.equalTo("employer", employerProfile);
          vacancyQuery.descending("createdAt");
          const results = await vacancyQuery.find();

          const formattedVacancies = results.map((v) => ({
            id: v.id,
            title: v.get("title"),
            location: v.get("address"), // Usando a coluna 'address'
            image: v.get("image")?.url() || "/barista.png", // Usa uma imagem padrão se não houver
          }));
          setVacancies(formattedVacancies);
        }
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVacancies();
  }, [router]);

  // 4. Implementamos a função para deletar
  const handleDeletar = async (vacancyId) => {
    if (window.confirm("Tem certeza que deseja deletar esta vaga?")) {
      const Vacancy = Parse.Object.extend("AvailableVacancy");
      const query = new Parse.Query(Vacancy);
      try {
        const vacancy = await query.get(vacancyId);
        await vacancy.destroy();
        setVacancies(vacancies.filter((v) => v.id !== vacancyId));
        alert("Vaga deletada com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar vaga:", error);
      }
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Carregando vagas...</p>;

  return (
    <main className="min-h-screen bg-white px-4 pt-6 pb-10 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="absolute top-4 left-4 bg-white p-1 rounded-xl w-max">
            <Image
              src="/logopages.png"
              alt="Logo"
              width={150}
              height={40}
              className="rounded-lg"
            />
          </div>
        </div>
        <Image
          src="/user.png"
          alt="/Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
      <p className="text-[#0A2753] text-base mb-4">Olá, {userName}!</p>
      <h1 className="text-3xl font-bold text-[#0B2568] mb-1">
        Quem você está procurando?
      </h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-[#0A2753] text-base">Vagas publicadas:</p>

        <Link href="/vaga/adicionar">
          <button className="flex items-center gap-1 bg-[#5A2FDA] text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:bg-[#5b21b6] transition">
            Adicionar
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {vacancies.map((vaga) => (
          <div
            key={vaga.id}
            className="relative rounded-2xl overflow-hidden shadow-md"
          >
            <Image
              src={vaga.image}
              alt={vaga.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => handleDeletar(vaga.id)}
              className="absolute top-3 left-3 bg-red-500 opacity-49 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-600 transition"
            >
              Deletar vaga
            </button>

            <Link href={`/vagas/editar/${vaga.id}`}>
              <button className="absolute top-10 left-3 bg-white opacity-49 text-[#0B2568] text-xs px-3 py-1 rounded-full shadow hover:bg-gray-200 transition">
                Editar dados da vaga
              </button>
            </Link>

            <div className="absolute bottom-3 left-3 text-white">
              <h2 className="text-lg font-semibold">{vaga.title}</h2>
              <p className="text-sm">{vaga.location}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
