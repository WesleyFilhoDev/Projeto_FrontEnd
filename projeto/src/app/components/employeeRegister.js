"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmployeeRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    skills: [],
  });

  const [novaSkill, setNovaSkill] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const adicionarSkill = () => {
    const skillTrimada = novaSkill.trim();
    if (skillTrimada && !formData.skills.includes(skillTrimada)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillTrimada],
      }));
      setNovaSkill("");
    }
  };

  const removerSkill = (skillRemover) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillRemover),
    }));
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
        {["nome", "sobrenome", "email", "senha", "cpf", "telefone"].map(
          (campo) => (
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
          )
        )}

        <div className="flex flex-col">
          <label className="text-[#0A2753] font-semibold mb-1">
            Skills (digite e clique em adicionar):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={novaSkill}
              onChange={(e) => setNovaSkill(e.target.value)}
              className="flex-1 bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
              placeholder="Ex: Garçom"
            />
            <button
              type="button"
              onClick={adicionarSkill}
              className="bg-[#A0A0A0] text-[#673DE6] font-semibold px-4 py-2 rounded-full hover:bg-[#c0c0c0] transition"
            >
              Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#673DE6] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removerSkill(skill)}
                  className="text-white font-bold"
                >
                  ×
                </button>
              </span>
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

      <p className="mt-6 text-center">
        <button
          onClick={() => router.push("/employeeLogin")}
          className="bg-[#E5E5E5] text-[#673DE6] font-semibold px-4 py-2 rounded-full hover:bg-[#d0d0d0] transition"
        >
          Já tenho cadastro
        </button>
      </p>
    </main>
  );
}
