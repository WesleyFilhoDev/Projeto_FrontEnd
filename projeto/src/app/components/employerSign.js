"use client";
import Image from "next/image";
import React, { useState } from "react"; // 1. Importar o useState
import Parse from "../services/back4app"; // 2. Importar nosso serviço de conexão

export default function EmployerSign() {
  // 3. Criar um estado para gerenciar todos os campos do formulário
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

  // 4. Função para atualizar o estado conforme o usuário digita
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // 5. Função principal que lida com o envio do formulário para o Back4App
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue

    // --- LÓGICA DE CRIAÇÃO NO BACK4APP ---
    const user = new Parse.User();
    // Combinando nome e sobrenome para o campo 'name' do User
    user.set("name", `${formData.nome} ${formData.sobrenome}`);
    user.set("username", formData.email); // Obrigatório, usamos o email
    user.set("email", formData.email);
    user.set("password", formData.senha);
    user.set("cpf", formData.cpf);
    user.set("phone", formData.telefone);

    try {
      // Passo A: Cria o objeto na classe _User
      await user.signUp();

      // Passo B: Cria o perfil na classe Employer
      const Employer = Parse.Object.extend("Employer");
      const employerProfile = new Employer();

      // Combinando campos de endereço
      const fullAddress = `${formData.endereco}, ${formData.bairro}, ${formData.cidade}`;
      employerProfile.set("address", fullAddress);

      // Passo C: Liga o perfil Employer ao _User recém-criado
      employerProfile.set("user", user);

      await employerProfile.save();

      alert("Contratante cadastrado com sucesso!");
      // Futuramente, você pode redirecionar o usuário para a tela de login
      // router.push('/login');
    } catch (error) {
      console.error("Erro ao cadastrar contratante:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Array de campos para gerar o formulário dinamicamente
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
        Cadastro de Contratante
      </h1>

      {/* 6. Adicionar o handler onSubmit ao formulário */}
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
              // 7. Conectar os inputs ao estado do React
              type={field.type}
              id={field.id}
              value={formData[field.id]}
              onChange={handleInputChange}
              required
              className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Cadastrar
        </button>
      </form>
      <p className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight">
        Já tenho cadastro
      </p>
    </main>
  );
}
