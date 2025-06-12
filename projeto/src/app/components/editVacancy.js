"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Parse from "../services/back4app";

export default function EditVacancy() {
  const router = useRouter();
  const params = useParams();
  const vacancyId = params.id;

  // 1. O estado agora inclui todos os campos da vaga
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
  const [isLoading, setIsLoading] = useState(true);

  // READ: Busca e preenche todos os dados da vaga
  useEffect(() => {
    if (vacancyId) {
      const fetchVacancyData = async () => {
        const Vacancy = Parse.Object.extend("AvailableVacancy");
        const query = new Parse.Query(Vacancy);
        try {
          const vacancy = await query.get(vacancyId);

          // 2. Preenche todos os campos do formulário com os dados do Back4App
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
          setIsLoading(false);
        }
      };
      fetchVacancyData();
    }
  }, [vacancyId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // UPDATE: Salva as alterações de todos os campos
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const Vacancy = Parse.Object.extend("AvailableVacancy");
    const query = new Parse.Query(Vacancy);
    try {
      const vacancyToUpdate = await query.get(vacancyId);

      // 3. Salva todos os campos atualizados no Back4App
      vacancyToUpdate.set("title", formData.title);
      vacancyToUpdate.set("workType", formData.workType);
      vacancyToUpdate.set("description", formData.description);
      vacancyToUpdate.set("requirements", formData.requirements);
      vacancyToUpdate.set("payment", Number(formData.payment));
      vacancyToUpdate.set("address", formData.street);
      vacancyToUpdate.set("neighborhood", formData.neighborhood);
      vacancyToUpdate.set("city", formData.city);

      await vacancyToUpdate.save();

      alert("Vaga atualizada com sucesso!");
      router.push("/dashboard-contratante"); // Adapte essa rota se necessário
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Carregando dados da vaga...</p>;
  }

  // 4. Array de campos para gerar o formulário de edição dinamicamente
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

  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      {/* ... seu cabeçalho ... */}
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
