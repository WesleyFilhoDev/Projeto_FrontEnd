// Indica que esse componente será renderizado no lado do cliente
"use client";

// Importa hooks do React para controlar estado e efeitos colaterais
import { useState, useEffect } from "react";

// Importa o componente de imagem do Next.js (não é usado aqui)
import Image from "next/image";

// Importa ferramentas de navegação e leitura de parâmetros da URL
import { useRouter, useParams } from "next/navigation";

// Importa o Parse já configurado para conectar com o Back4App
import Parse from "../services/back4app";

// Componente principal da página de edição de vagas
export default function EditVacancy() {
  // Hook do Next.js para navegação entre páginas
  const router = useRouter();

  // Hook do Next.js para pegar os parâmetros da URL
  const params = useParams();

  // Pega o ID da vaga da URL
  const vacancyId = params.id;

  // Estado que armazena os dados do formulário da vaga
  const [formData, setFormData] = useState({
    title: "",
    workType: "",
    description: "",
    requirements: "",
    payment: "",
    street: "",
    neighborhood: "",
    city: "",
  });

  // Estado para exibir carregamento até os dados serem buscados
  const [isLoading, setIsLoading] = useState(true);

  // Hook de efeito que roda ao carregar a página ou quando o ID da vaga mudar
  useEffect(() => {
    if (vacancyId) {
      const fetchVacancyData = async () => {
        // Define a classe da vaga no Back4App
        const Vacancy = Parse.Object.extend("AvailableVacancy");

        // Cria uma consulta para buscar a vaga pelo ID
        const query = new Parse.Query(Vacancy);

        try {
          // Busca a vaga com o ID especificado
          const vacancy = await query.get(vacancyId);

          // Preenche o formulário com os dados da vaga do Back4App
          setFormData({
            title: vacancy.get("title") || "",
            workType: vacancy.get("workType") || "",
            description: vacancy.get("description") || "",
            requirements: vacancy.get("requirements") || "",
            payment: vacancy.get("payment") || "",
            street: vacancy.get("address") || "",
            neighborhood: vacancy.get("neighborhood") || "",
            city: vacancy.get("city") || "",
          });
        } catch (error) {
          console.error("Erro ao buscar vaga:", error);
          alert("Erro: Vaga não encontrada.");
        } finally {
          // Desativa o carregamento
          setIsLoading(false);
        }
      };

      // Executa a função de busca
      fetchVacancyData();
    }
  }, [vacancyId]);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Função para lidar com o envio do formulário (atualização da vaga)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const Vacancy = Parse.Object.extend("AvailableVacancy");
    const query = new Parse.Query(Vacancy);

    try {
      // Busca a vaga a ser atualizada pelo ID
      const vacancyToUpdate = await query.get(vacancyId);

      // Atualiza os campos da vaga com os dados do formulário
      vacancyToUpdate.set("title", formData.title);
      vacancyToUpdate.set("workType", formData.workType);
      vacancyToUpdate.set("description", formData.description);
      vacancyToUpdate.set("requirements", formData.requirements);
      vacancyToUpdate.set("payment", Number(formData.payment));
      vacancyToUpdate.set("address", formData.street);
      vacancyToUpdate.set("neighborhood", formData.neighborhood);
      vacancyToUpdate.set("city", formData.city);

      // Salva a vaga atualizada no Back4App
      await vacancyToUpdate.save();

      alert("Vaga atualizada com sucesso!");

      // Redireciona para a página de vagas do empregador
      router.push("/vacancyEmployer");
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Exibe um texto de carregamento enquanto os dados são buscados
  if (isLoading) {
    return <p className="text-center mt-10">Carregando dados da vaga...</p>;
  }

  // Array que define os campos do formulário dinamicamente
  const formFields = [
    { label: "Título", id: "title", type: "text" },
    { label: "Tipo de trabalho", id: "workType", type: "text" },
    { label: "Descrição", id: "description", type: "textarea" },
    { label: "Requisitos", id: "requirements", type: "text" },
    { label: "Salário", id: "payment", type: "number" },
    { label: "Endereço (Rua, Nº)", id: "street", type: "text" },
    { label: "Bairro", id: "neighborhood", type: "text" },
    { label: "Cidade", id: "city", type: "text" },
  ];

  // JSX que renderiza a interface
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Altere os dados <br /> da vaga
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        {formFields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label
              htmlFor={field.id}
              className="text-[#0A2753] font-semibold mb-1"
            >
              {field.label}:
            </label>

            {/* Campo de texto ou textarea dependendo do tipo */}
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                required
                className="bg-[#E5E5E5] text-black rounded-2xl px-4 py-2 outline-none h-24"
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                required
                className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
              />
            )}
          </div>
        ))}

        {/* Botão de envio */}
        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  );
}
