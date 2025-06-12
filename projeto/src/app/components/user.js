"use client"; // Indica que esse componente roda no client-side (Next.js)

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Parse from "../services/back4app";
import { useRouter } from "next/navigation";

// Componente principal do perfil do usuário
export default function UserProfile() {
  const router = useRouter();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    neighborhood: "",
    city: "",
  });

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Estado para armazenar o objeto do perfil (Employer ou Employee)
  const [userProfile, setUserProfile] = useState(null);

  // Hook que roda ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("1. Iniciando busca de dados do perfil...");
      const currentUser = Parse.User.current();

      // Se o usuário não estiver logado, redireciona para login
      if (!currentUser) {
        alert("Por favor, faça o login para ver seu perfil.");
        router.push("/login");
        return;
      }
      console.log("2. Usuário encontrado:", currentUser.get("name"));

      try {
        // Tenta buscar o perfil na classe "Employer"
        let profileQuery = new Parse.Query("Employer");
        profileQuery.equalTo("user", currentUser);
        console.log("3. Buscando na classe Employer...");
        let profile = await profileQuery.first();
        console.log("4. Perfil Employer encontrado:", profile);

        // Se não encontrar, busca em "Employee"
        if (!profile) {
          console.log(
            "5. Nenhum perfil Employer encontrado. Buscando na classe Employee..."
          );
          profileQuery = new Parse.Query("Employee");
          profileQuery.equalTo("user", currentUser);
          profile = await profileQuery.first();
          console.log("6. Perfil Employee encontrado:", profile);
        }

        // Salva o perfil encontrado
        setUserProfile(profile);

        // Preenche os dados do formulário com os dados do usuário atual
        const fullName = currentUser.get("name") || "";
        const nameParts = fullName.split(" ");
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ") || "";

        setFormData({
          name: firstName,
          lastName: lastName,
          email: currentUser.get("email") || "",
          phone: currentUser.get("phone") || "",
          address: profile?.get("address") || "",
          neighborhood: profile?.get("neighborhood") || "",
          city: profile?.get("city") || "",
          password: "",
        });

        console.log(
          "7. Dados do formulário preenchidos. Carregamento concluído."
        );
      } catch (error) {
        console.error("ERRO na busca de dados:", error);
      } finally {
        setIsLoading(false); // Finaliza carregamento
      }
    };

    fetchUserData();
  }, [router]);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Envia os dados atualizados para o backend
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const currentUser = Parse.User.current();

    try {
      // Atualiza campos do usuário
      currentUser.set("name", `${formData.name} ${formData.lastName}`);
      currentUser.set("email", formData.email);
      currentUser.set("username", formData.email);
      currentUser.set("phone", formData.phone);

      // Se uma nova senha foi fornecida, atualiza
      if (formData.password) {
        currentUser.set("password", formData.password);
      }

      // Atualiza campos específicos do perfil (Employer ou Employee)
      if (userProfile) {
        userProfile.set("address", formData.address);
        userProfile.set("neighborhood", formData.neighborhood);
        userProfile.set("city", formData.city);

        // Salva ambos: usuário e perfil
        await Parse.Object.saveAll([currentUser, userProfile]);
      } else {
        // Caso só tenha o usuário, salva apenas ele
        await currentUser.save();
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Mostra mensagem enquanto os dados estão carregando
  if (isLoading) {
    return <p className="text-center mt-10">Carregando perfil...</p>;
  }

  // Renderiza o formulário
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans">
      {/* Logo */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image src="/logopages.png" alt="Logo" width={150} height={40} />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Seu Perfil
      </h1>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <Image
          src="/user.png"
          alt="Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {/* Formulário de edição do perfil */}
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        {/* Nome */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-[#0A2753] font-semibold mb-1">
            Nome:
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Sobrenome */}
        <div className="flex flex-col">
          <label
            htmlFor="lastName"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Sobrenome:
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[#0A2753] font-semibold mb-1">
            E-mail:
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Nova Senha:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Deixe em branco para não alterar"
            value={formData.password}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Telefone */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-[#0A2753] font-semibold mb-1">
            Telefone:
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Endereço */}
        <div className="flex flex-col">
          <label
            htmlFor="address"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Endereço (Rua, Nº):
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Bairro */}
        <div className="flex flex-col">
          <label
            htmlFor="neighborhood"
            className="text-[#0A2753] font-semibold mb-1"
          >
            Bairro:
          </label>
          <input
            id="neighborhood"
            type="text"
            value={formData.neighborhood}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Cidade */}
        <div className="flex flex-col">
          <label htmlFor="city" className="text-[#0A2753] font-semibold mb-1">
            Cidade:
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="bg-[#E5E5E5] text-black rounded-full px-4 py-2 outline-none"
          />
        </div>

        {/* Botão de envio */}
        <button
          type="submit"
          className="bg-[#673DE6] text-white rounded-full py-2 text-center mt-4 hover:bg-[#5a32cc] transition"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  );
}
