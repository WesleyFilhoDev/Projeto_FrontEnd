"use client";
import { useState } from "react";
import Image from "next/image";

export default function EmployeeRegister() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    skills: [],
  });

  const skillsDisponiveis = [
    "Garçom",
    "Atendente",
    "Cozinheiro",
    "Barista",
    "Segurança",
    "Caixa",
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const jaSelecionado = prev.skills.includes(skill);
      return {
        ...prev,
        skills: jaSelecionado
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cadastro enviado:", formData);
   
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
        Cadastro de Candidato
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       
        {["email", "senha", "cpf", "telefone"].map((campo) => (
          <div key={campo} className="flex flex-col">
            <label
              htmlFor={campo}
              className="text-[#0A2753] font-semibold mb-1 capitalize"
            >
              {campo}:
            </label>
            <input
              type={campo === "senha" ? "password" : "text"}
              id={campo}
              value={formData[campo]}
              onChange={handleChange}
              className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
            />
          </div>
        ))}


        <div className="flex flex-col">
          <label className="text-[#0A2753] font-semibold mb-2">
            Principais Skills:
          </label>
          <div className="flex flex-wrap gap-2">
            {skillsDisponiveis.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full border ${
                  formData.skills.includes(skill)
                    ? "bg-[#673DE6] text-white"
                    : "bg-[#E5E5E5] text-black"
                } transition`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        
        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Cadastrar
        </button>
      </form>

    
<button
  onClick={() => router.push("/employeeLogin")}
  className="mt-6 text-[#0B2568] font-semibold underline hover:text-purple-600 transition block mx-auto"
>
  Já tenho cadastro
</button>

    </main>
  );
}
