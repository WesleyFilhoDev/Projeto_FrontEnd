// Indica que o componente será renderizado no lado do cliente
"use client";

// Importa os módulos necessários
import Image from "next/image"; // Para imagens otimizadas
import React, { useState } from "react"; // useState para manipular os inputs
import Parse from "../services/back4app"; // SDK do Parse para autenticação
import Link from "next/link"; // Link para navegação entre páginas
import { useRouter } from "next/navigation"; // Hook para redirecionamento

// Componente da página de login do contratante (Employer)
export default function EmployerLogin() {
  const router = useRouter(); // Inicializa o roteador para redirecionar após o login

  // Estados para armazenar os valores dos campos de email e senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    try {
      // Tenta fazer login com os dados fornecidos
      const loggedInUser = await Parse.User.logIn(email, password);

      // Cria uma query para buscar o perfil do tipo Employer vinculado ao usuário
      const Employer = Parse.Object.extend("Employer");
      const query = new Parse.Query(Employer);
      query.equalTo("user", loggedInUser); // Verifica se o usuário está na tabela Employer
      const employerProfile = await query.first(); // Busca o primeiro resultado

      if (employerProfile) {
        // Se o perfil de contratante existir, mostra alerta e redireciona
        alert(`Login bem-sucedido! Bem-vindo(a), ${loggedInUser.get("name")}!`);
        router.push("/vacancyEmployer"); // Redireciona para a página de vagas do contratante
      } else {
        // Se não for um contratante, desloga e mostra erro
        await Parse.User.logOut();
        alert("Erro: Este usuário não é um contratante. Acesso negado.");
      }
    } catch (error) {
      // Caso ocorra qualquer erro no processo
      console.error("Erro ao fazer login:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    // Container principal com padding e estilização geral
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      {/* Cabeçalho com logo e avatar */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image
            src="/logopages.png" // Logo do sistema
            alt="Logo"
            width={150}
            height={40}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Título da tela */}
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Login de Contratante
      </h1>

      {/* Formulário de login */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Campo de e-mail */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[#0A2753] font-semibold mb-1">
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            value={email} // Estado controlado
            onChange={(e) => setEmail(e.target.value)} // Atualiza estado
            required
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Campo de senha */}
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
            value={password} // Estado controlado
            onChange={(e) => setPassword(e.target.value)} // Atualiza estado
            required
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Botão de envio do formulário */}
        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Entrar
        </button>
      </form>

      {/* Link para a página de cadastro de contratante */}
      <Link href="/employerSign">
        <p className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight hover:text-purple-600 transition cursor-pointer">
          Não tenho cadastro
        </p>
      </Link>
    </main>
  );
}
