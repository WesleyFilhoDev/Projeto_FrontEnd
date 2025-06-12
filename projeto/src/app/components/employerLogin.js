"use client";
import Image from "next/image";
import React, { useState } from "react";
import Parse from "../services/back4app";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Importar o useRouter

export default function EmployerLogin() {
  const router = useRouter(); // 2. Inicializar o router

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = await Parse.User.logIn(email, password);
      const Employer = Parse.Object.extend("Employer");
      const query = new Parse.Query(Employer);
      query.equalTo("user", loggedInUser);
      const employerProfile = await query.first();

      if (employerProfile) {
        alert(`Login bem-sucedido! Bem-vindo(a), ${loggedInUser.get("name")}!`);

        router.push("/vacancyEmployer");
      } else {
        await Parse.User.logOut();
        alert("Erro: Este usuário não é um contratante. Acesso negado.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert(`Erro: ${error.message}`);
    }
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
        Login de Contratante
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[#0A2753] font-semibold mb-1">
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Senha:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Entrar
        </button>
      </form>

      <Link href="/employerSign">
        <p className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight hover:text-purple-600 transition cursor-pointer">
          Não tenho cadastro
        </p>
      </Link>
    </main>
  );
}
