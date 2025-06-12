"use client";
import { useState, useEffect } from "react"; // 1. Importar useEffect
import Image from "next/image";
import { useRouter, useParams } from "next/navigation"; // 2. Para pegar ID da URL e redirecionar
import Parse from "../services/back4app"; // 3. Importar conexão

export default function EditVacancy() {
  const router = useRouter();
  const params = useParams();
  const vacancyId = params.id; // Pega o ID da vaga da URL, ex: /vagas/editar/aBcDeFg123

  // 4. Estado do formulário, agora com chaves que correspondem ao banco
  const [formData, setFormData] = useState({
    title: "",
    workType: "",
    description: "",
    requirements: "",
    payment: 0,
    location: "", // Supondo que endereço, bairro e cidade formem a 'location'
  });
  const [isLoading, setIsLoading] = useState(true); // Estado para feedback de carregamento

  // 5. READ: Busca os dados da vaga no Back4App quando a página carrega
  useEffect(() => {
    // Só executa se tivermos um ID na URL
    if (vacancyId) {
      const fetchVacancyData = async () => {
        const Vacancy = Parse.Object.extend("AvailableVacancy");
        const query = new Parse.Query(Vacancy);
        try {
          const vacancy = await query.get(vacancyId);
          // Preenche o formulário com os dados que vieram do back-end
          setFormData({
            title: vacancy.get("title") || "",
            workType: vacancy.get("workType") || "", // Crie esta coluna se necessário
            description: vacancy.get("description") || "",
            requirements: vacancy.get("requirements") || "", // Crie esta coluna se necessário
            payment: vacancy.get("payment") || 0,
            location: vacancy.get("location") || "",
          });
          setIsLoading(false); // Terminou de carregar
        } catch (error) {
          console.error("Erro ao buscar vaga:", error);
          alert("Erro: Vaga não encontrada.");
          setIsLoading(false);
        }
      };
      fetchVacancyData();
    }
  }, [vacancyId]); // A dependência [vacancyId] faz isso rodar quando o ID estiver disponível

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 6. UPDATE: Função chamada para salvar as alterações
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const Vacancy = Parse.Object.extend("AvailableVacancy");
    const query = new Parse.Query(Vacancy);
    try {
      const vacancyToUpdate = await query.get(vacancyId);

      // Atualiza cada campo com os novos valores do formulário
      vacancyToUpdate.set("title", formData.title);
      vacancyToUpdate.set("workType", formData.workType);
      vacancyToUpdate.set("description", formData.description);
      vacancyToUpdate.set("requirements", formData.requirements);
      vacancyToUpdate.set("payment", Number(formData.payment)); // Converte para número
      vacancyToUpdate.set("location", formData.location);

      // Salva o objeto atualizado no Back4App
      await vacancyToUpdate.save();

      alert("Vaga atualizada com sucesso!");
      router.push("/dashboard-contratante"); // Redireciona para o painel
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Carregando dados da vaga...</p>;
  }

  // O JSX foi adaptado para usar os novos nomes de campos (em inglês/camelCase)
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      {/* ... seu cabeçalho aqui ... */}
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Altere os dados <br /> da vaga
      </h1>

      {/* 7. Conectar o formulário à função de UPDATE */}
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        {/* Título */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-[#0A2753] font-semibold mb-1">
            Título:
          </label>
          <input
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>
        {/* Adicione os outros campos aqui seguindo o modelo acima, usando os IDs: 'workType', 'description', etc. */}
        {/* Exemplo para Descrição */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Descrição:
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-2xl px-4 py-2 outline-none"
          />
        </div>
        {/* Exemplo para Salário */}
        <div className="flex flex-col">
          <label
            htmlFor="payment"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Salário:
          </label>
          <input
            type="number"
            id="payment"
            value={formData.payment}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Editar Vaga
        </button>
      </form>
    </main>
  );
}
