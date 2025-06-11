"use client";
import Image from "next/image";

export default function VacancyAdd() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image
            src="/Ti.png"
            alt="Logo"
            width={150}
            height={40}
            className="rounded-lg"
          />
        </div>
        <Image
          src="/man.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Digite os dados <br /> da nova vaga
      </h1>

      <form className="flex flex-col gap-4">
        {[
          "Título",
          "Tipo de trabalho",
          "Descrição",
          "Requisitos",
          "Salário",
          "Endereço",
          "Bairro",
          "Cidade",
        ].map((label) => (
          <div key={label} className="flex flex-col">
            <label
              htmlFor={label.toLowerCase()}
              className="text-[#0A2753] font-semibold mb-1"
            >
              {label}:
            </label>
            <input
              type={label === "Salário" ? "number" : "text"}
              step={label === "Salário" ? "any" : undefined}
              id={label.toLowerCase()}
              className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
            />
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
