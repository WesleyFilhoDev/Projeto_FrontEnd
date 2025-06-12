"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Parse from "../services/back4app";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("1. Iniciando busca de dados do perfil...");
      const currentUser = Parse.User.current();

      if (!currentUser) {
        alert("Por favor, faça o login para ver seu perfil.");
        router.push("/login");
        return;
      }
      console.log("2. Usuário encontrado:", currentUser.get("name"));

      try {
        // Tenta buscar em Employer primeiro
        let profileQuery = new Parse.Query("Employer");
        profileQuery.equalTo("user", currentUser);
        console.log("3. Buscando na classe Employer...");
        let profile = await profileQuery.first();
        console.log("4. Perfil Employer encontrado:", profile);

        // Se não encontrou, tenta buscar em Employee
        if (!profile) {
          console.log(
            "5. Nenhum perfil Employer encontrado. Buscando na classe Employee..."
          );
          profileQuery = new Parse.Query("Employee");
          profileQuery.equalTo("user", currentUser);
          profile = await profileQuery.first();
          console.log("6. Perfil Employee encontrado:", profile);
        }

        setUserProfile(profile);

        // O resto da lógica para preencher o formulário...
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
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const currentUser = Parse.User.current();

    try {
      currentUser.set("name", `${formData.name} ${formData.lastName}`);
      currentUser.set("email", formData.email);
      currentUser.set("username", formData.email);
      // --------------------------

      currentUser.set("phone", formData.phone);

      if (formData.password) {
        currentUser.set("password", formData.password);
      }

      if (userProfile) {
        userProfile.set("address", formData.address);
        userProfile.set("neighborhood", formData.neighborhood);
        userProfile.set("city", formData.city);

        await Parse.Object.saveAll([currentUser, userProfile]);
      } else {
        await currentUser.save();
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Carregando perfil...</p>;
  }

  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image src="/logopages.png" alt="Logo" width={150} height={40} />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#0B2568] mb-6 leading-tight">
        Seu Perfil
      </h1>

      <div className="flex justify-center mb-6">
        <Image
          src="/user.png"
          alt="Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
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
