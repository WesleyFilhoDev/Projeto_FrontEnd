"use client";
import Image from "next/image";
import React, { useState } from "react";
import Parse from "../services/back4app";
import Link from "next/link";

export default function EmployerSign() {
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = new Parse.User();
    user.set("name", `${formData.nome} ${formData.sobrenome}`);
    user.set("username", formData.email);
    user.set("email", formData.email);
    user.set("password", formData.senha);
    user.set("cpf", formData.cpf);
    user.set("phone", formData.telefone);

    try {
      await user.signUp();

      const Employer = Parse.Object.extend("Employer");
      const employerProfile = new Employer();

      const fullAddress = `${formData.endereco}, ${formData.bairro}, ${formData.cidade}`;
      employerProfile.set("address", fullAddress);

      employerProfile.set("user", user);

      await employerProfile.save();

      alert("Contratante cadastrado com sucesso!");

      // router.push('/login');
    } catch (error) {
      console.error("Erro ao cadastrar contratante:", error);
      alert(`Erro: ${error.message}`);
    }
  };

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

        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Cadastrar
        </button>
      </form>

      <Link href="/employerLogin">
        <p className="text-1xl text-center font-bold text-[#0B2568] mt-6 leading-tight hover:text-purple-600 transition cursor-pointer">
          Já tenho cadastro
        </p>
      </Link>
    </main>
  );
}
