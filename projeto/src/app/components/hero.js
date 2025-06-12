"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold text-center text-black mb-10">
          Tramp
          <span className="text-purple-600 font-bold">ai</span>
        </h1>

        <div className="flex flex-col gap-4 w-full">
          <Link href="/employeeLogin">
            <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition">
              Entrar como Candidato
            </button>
          </Link>

          <Link href="/employerLogin">
            <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-50 transition">
              Entrar como Contratante
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
