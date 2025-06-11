"use client";
import Image from "next/image";

export default function VacancyAdd() {
  return (
    <main className="min-h-screen bg-white px-6 pt-6 pb-10 max-w-md mx-auto font-sans shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white p-1 rounded-xl w-max">
          <Image
            src="/Ti.png"
            alt="Logo"
            width={150}
            height={40}
            className="rounded-lg"
          />
        </div>
        <Image
          src="/man.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </main>
  );
}
