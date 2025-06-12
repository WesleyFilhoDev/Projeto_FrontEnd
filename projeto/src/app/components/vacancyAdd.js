"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "../services/back4app";

export default function VacancyAdd() {
  const router = useRouter();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    title: "",
    workType: "",
    description: "",
    requirements: "",
    payment: "",
    address: "",
    neighborhood: "",
    city: "",
  });

  // Atualiza os dados do formulário conforme o usuário digita
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = Parse.User.current();
    // Se o usuário não estiver logado, redireciona para o login
    if (!currentUser) {
      alert("Você precisa estar logado como contratante para criar uma vaga.");
      router.push("/employerLogin");
      return;
    }

    try {
      // Busca o perfil de contratante relacionado ao usuário logado
      const Employer = Parse.Object.extend("Employer");
      const employerQuery = new Parse.Query(Employer);
      employerQuery.equalTo("user", currentUser);
      const employerProfile = await employerQuery.first();

      if (!employerProfile) {
        alert("Erro: Perfil de contratante não encontrado para este usuário.");
        return;
      }

      // Cria uma nova vaga
      const Vacancy = Parse.Object.extend("AvailableVacancy");
      const newVacancy = new Vacancy();

      // Combina os campos de endereço em uma única string
      const fullAddress = `${formData.address}, ${formData.neighborhood}, ${formData.city}`;

      // Define os campos da nova vaga
      newVacancy.set("title", formData.title);
      newVacancy.set("workType", formData.workType);
      newVacancy.set("description", formData.description);
      newVacancy.set("requirements", formData.requirements);
      newVacancy.set("payment", Number(formData.payment));
      newVacancy.set("neighborhood", formData.neighborhood);
      newVacancy.set("address", formData.address);
      newVacancy.set("city", formData.city);
      newVacancy.set("status", "Aberta");

      // Salva o endereço completo na coluna "address"
      newVacancy.set("address", fullAddress);

      // Associa a vaga ao contratante
      newVacancy.set("employer", employerProfile);

      // Salva a nova vaga no banco
      await newVacancy.save();

      alert("Nova vaga criada com sucesso!");
      router.push("/vacancyEmployer");
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Campos do formulário
  const formFields = [
    { label: "Título", id: "title", type: "text" },
    { label: "Tipo de trabalho", id: "workType", type: "text" },
    { label: "Descrição", id: "description", type: "textarea" },
    { label: "Requisitos", id: "requirements", type: "text" },
    { label: "Salário", id: "payment", type: "number" },
    { label: "Endereço (Rua, Nº)", id: "address", type: "text" },
    { label: "Bairro", id: "neighborhood", type: "text" },
    { label: "Cidade", id: "city", type: "text" },
  ];

  // Renderiza o formulário na interface
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Digite os dados <br /> da nova vaga
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                onChange={handleInputChange}
                required
                className="bg-[#E5E5E5] text-black rounded-2xl px-4 py-2 outline-none h-24"
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id]}
                onChange={handleInputChange}
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
          Criar nova vaga
        </button>
      </form>
    </main>
  );
}
