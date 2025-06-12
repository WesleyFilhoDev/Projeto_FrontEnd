"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Parse from "../services/back4app";
import { useRouter } from "next/navigation";

export default function VacancyEmployer() {
  const router = useRouter();

  // Estado para armazenar a lista de vagas
  const [vacancies, setVacancies] = useState([]);

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Nome do usuário logado
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Função para buscar as vagas do contratante logado
    const fetchVacancies = async () => {
      const currentUser = Parse.User.current();

      // Se não estiver logado, redireciona para login
      if (!currentUser) {
        router.push("/employerLogin");
        return;
      }

      // Pega o nome do usuário para exibir na interface
      setUserName(currentUser.get("name"));

      try {
        // Busca o perfil do contratante
        const Employer = Parse.Object.extend("Employer");
        const employerQuery = new Parse.Query(Employer);
        employerQuery.equalTo("user", currentUser);
        const employerProfile = await employerQuery.first();

        if (employerProfile) {
          // Busca todas as vagas criadas por esse contratante
          const Vacancy = Parse.Object.extend("AvailableVacancy");
          const vacancyQuery = new Parse.Query(Vacancy);
          vacancyQuery.equalTo("employer", employerProfile);
          vacancyQuery.descending("createdAt"); // Ordena por mais recente

          const results = await vacancyQuery.find();

          // Formata os dados das vagas
          const formattedVacancies = results.map((v) => ({
            id: v.id,
            title: v.get("title"),
            location: v.get("address"),
            image: v.get("image")?.url() || "/barista.png", // Imagem padrão
          }));

          setVacancies(formattedVacancies);
        }
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      } finally {
        // Finaliza o carregamento
        setIsLoading(false);
      }
    };

    // Executa a busca assim que o componente monta
    fetchVacancies();
  }, [router]);

  // Função para deletar uma vaga
  const handleDeletar = async (vacancyId) => {
    if (window.confirm("Tem certeza que deseja deletar esta vaga?")) {
      const Vacancy = Parse.Object.extend("AvailableVacancy");
      const query = new Parse.Query(Vacancy);

      try {
        const vacancy = await query.get(vacancyId);
        await vacancy.destroy();

        // Remove a vaga deletada da lista
        setVacancies(vacancies.filter((v) => v.id !== vacancyId));
        alert("Vaga deletada com sucesso.");
      } catch (error) {
        console.error("Erro ao deletar vaga:", error);
      }
    }
  };

  // Enquanto carrega os dados
  if (isLoading)
    return <p className="text-center mt-10">Carregando vagas...</p>;

  // Interface principal
  return (
    <main className="min-h-screen bg-white px-4 pt-6 pb-10 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {/* Logo da página */}
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

        {/* Link para o perfil do usuário */}
        <Link href="/user">
          <Image
            src="/user.png"
            alt="Avatar do Usuário"
            width={36}
            height={36}
            className="rounded-full cursor-pointer"
          />
        </Link>
      </div>

      {/* Saudação ao usuário */}
      <p className="text-[#0A2753] text-base mb-4">Olá, {userName}!</p>

      {/* Título da seção */}
      <h1 className="text-3xl font-bold text-[#0B2568] mb-1">
        Quem você está procurando?
      </h1>

      {/* Cabeçalho com botão para adicionar nova vaga */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-[#0A2753] text-base">Vagas publicadas:</p>
        <Link href="/add_vaga">
          <button className="flex items-center gap-1 bg-[#5A2FDA] text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:bg-[#5b21b6] transition">
            Adicionar
          </button>
        </Link>
      </div>

      {/* Lista de vagas */}
      <div className="flex flex-col gap-4">
        {vacancies.map((vaga) => (
          <div
            key={vaga.id}
            className="relative rounded-2xl overflow-hidden shadow-md"
          >
            {/* Imagem da vaga */}
            <Image
              src={vaga.image}
              alt={vaga.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />

            {/* Botão de deletar vaga */}
            <button
              onClick={() => handleDeletar(vaga.id)}
              className="absolute top-3 left-3 bg-red-500 opacity-49 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-red-600 transition"
            >
              Deletar vaga
            </button>

            {/* Botão de editar vaga */}
            <Link href={`/vagas/editar/${vaga.id}`}>
              <button className="absolute top-10 left-3 bg-white opacity-49 text-[#0B2568] text-xs px-3 py-1 rounded-full shadow hover:bg-gray-200 transition">
                Editar dados da vaga
              </button>
            </Link>

            {/* Informações da vaga */}
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
