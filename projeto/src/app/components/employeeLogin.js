"use client";
import Image from "next/image";
import Link from "next/link";

export default function EmployeeLogin() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Link href="/hero">
            <Image
              src="/logopages.png"
              alt="Logo"
              width={150}
              height={40}
              className="rounded-lg"
            />
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Login de Trabalhador
      </h1>

      <form className="flex flex-col gap-4">
        {["E-mail", "Senha"].map((label) => (
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
          Entrar
        </button>
      </form>
      <div>
        <Link
          href="/employeeRegister"
          className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight hover:text-purple-600 transition cursor-pointer"
        >
          Não tenho cadastro
        </Link>
      </div>
    </main>
  );
}
