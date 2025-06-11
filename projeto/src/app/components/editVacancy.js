"use client";
import { useState } from "react";
import Image from "next/image";

export default function EditVacancy() {
  const [formData, setFormData] = useState({
    título: "Barista",
    "tipo de trabalho": "Presencial",
    descrição: "Preparar cafés especiais e bebidas.",
    requisitos: "Experiência com cafeteria",
    salário: 1800,
    endereço: "Rua das Flores, 123",
    bairro: "Espinheiro",
    cidade: "Recife",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image
            src="/logopages.png"
            alt="Logo"
            width={150}
            height={40}
            className="rounded-lg"
          />
        </div>
        <Image
          src="/user.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Altere os dados <br /> da vaga
      </h1>

      <form className="flex flex-col gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="text-[#0A2753] font-semibold mb-1 capitalize"
            >
              {key}:
            </label>
            <input
              type={key === "salário" ? "number" : "text"}
              step={key === "salário" ? "any" : undefined}
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
            />
          </div>
        ))}

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
