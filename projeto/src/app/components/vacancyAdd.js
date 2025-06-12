"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "../services/back4app";

export default function VacancyAdd() {
  const router = useRouter();

  // 1. O estado agora tem campos separados para o endereço
  const [formData, setFormData] = useState({
    title: "",
    workType: "",
    description: "",
    requirements: "",
    payment: "",
    address: "", // Campo para Rua e Número
    neighborhood: "", // Campo para Bairro
    city: "", // Campo para Cidade
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = Parse.User.current();
    if (!currentUser) {
      alert("Você precisa estar logado como contratante para criar uma vaga.");
      router.push("/employer-login");
      return;
    }

    try {
      const Employer = Parse.Object.extend("Employer");
      const employerQuery = new Parse.Query(Employer);
      employerQuery.equalTo("user", currentUser);
      const employerProfile = await employerQuery.first();

      if (!employerProfile) {
        alert("Erro: Perfil de contratante não encontrado para este usuário.");
        return;
      }

      const Vacancy = Parse.Object.extend("AvailableVacancy");
      const newVacancy = new Vacancy();

      // 2. Combina os campos de endereço em uma única string
      const fullAddress = `${formData.address}, ${formData.neighborhood}, ${formData.city}`;

      // Preenche os campos da vaga
      newVacancy.set("title", formData.title);
      newVacancy.set("workType", formData.workType);
      newVacancy.set("description", formData.description);
      newVacancy.set("requirements", formData.requirements);
      newVacancy.set("payment", Number(formData.payment));
      newVacancy.set("neighborhood", formData.neighborhood);
      newVacancy.set("address", formData.address);
      newVacancy.set("city", formData.city);
      newVacancy.set("status", "Aberta");

      // Salva o endereço combinado na coluna "address" do Back4App
      newVacancy.set("address", fullAddress);

      // Associa a vaga ao contratante
      newVacancy.set("employer", employerProfile);

      await newVacancy.save();

      alert("Nova vaga criada com sucesso!");
      router.push("/dashboard-contratante");
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // 3. O array de campos agora reflete os inputs separados
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

  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      {/* ... seu cabeçalho ... */}
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
