"use client"; // Indica que esse componente roda no cliente (Next.js 13+)

// Importações necessárias
import Image from "next/image";
import React, { useState } from "react";
import Parse from "../services/back4app";
import Link from "next/link";

export default function EmployerSign() {
  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    endereco: "",
    bairro: "",
    cidade: "",
  });

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Função que é executada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criação do usuário padrão do Parse
    const user = new Parse.User();
    user.set("name", `${formData.nome} ${formData.sobrenome}`);
    user.set("username", formData.email);
    user.set("email", formData.email);
    user.set("password", formData.senha);
    user.set("cpf", formData.cpf);
    user.set("phone", formData.telefone);

    try {
      // Cadastro do usuário no Parse
      await user.signUp();

      // Criação do objeto Employer (contratante)
      const Employer = Parse.Object.extend("Employer");
      const employerProfile = new Employer();

      // Montagem do endereço completo
      const fullAddress = `${formData.endereco}, ${formData.bairro}, ${formData.cidade}`;
      employerProfile.set("address", fullAddress);

      // Relacionamento com o usuário criado
      employerProfile.set("user", user);

      // Salvando o perfil de contratante
      await employerProfile.save();

      alert("Contratante cadastrado com sucesso!");

      // Redirecionamento comentado (pode ser usado futuramente)
      // router.push('/login');
    } catch (error) {
      // Tratamento de erro no cadastro
      console.error("Erro ao cadastrar contratante:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Campos do formulário definidos em um array
  const formFields = [
    { label: "Nome", id: "nome", type: "text" },
    { label: "Sobrenome", id: "sobrenome", type: "text" },
    { label: "E-mail", id: "email", type: "email" },
    { label: "Senha", id: "senha", type: "password" },
    { label: "CPF", id: "cpf", type: "text" },
    { label: "Telefone", id: "telefone", type: "tel" },
    { label: "Endereço", id: "endereco", type: "text" },
    { label: "Bairro", id: "bairro", type: "text" },
    { label: "Cidade", id: "cidade", type: "text" },
  ];

  return (
    // Container principal da página
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      {/* Cabeçalho com logo e avatar */}
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

      {/* Título da página */}
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Cadastro de Contratante
      </h1>

      {/* Formulário de cadastro */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label
              htmlFor={field.id}
              className="text-[#0A2753] font-semibold mb-1"
            >
              {field.label}:
            </label>
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id]}
              onChange={handleInputChange}
              required
              className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
            />
          </div>
        ))}

        {/* Botão de envio */}
        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Cadastrar
        </button>
      </form>

      {/* Link para login */}
      <Link href="/employerLogin">
        <p className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight hover:text-purple-600 transition cursor-pointer">
          Já tenho cadastro
        </p>
      </Link>
    </main>
  );
}
