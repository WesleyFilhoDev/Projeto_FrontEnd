export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <h1 className="text-3xl font-semibold text-center text-black mb-10">
          Tramp
          <span className="text-purple-600 font-bold">ai</span>
        </h1>

        {/* Botões */}
        <div className="flex flex-col gap-4 w-full">
          <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition">
            Entrar como Candidato
          </button>
          <button className="w-full border border-purple-600 text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-50 transition">
            Entrar como Contratane
          </button>
        </div>
      </div>
    </main>
  );
}
