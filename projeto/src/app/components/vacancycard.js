"use client";
import Image from "next/image";

export default function VacancyCard({
  image,
  title,
  location,
  buttonLabel,
  onButtonClick,
}) {
  return (
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-md group">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm">{location}</p>
        </div>
        <button
          onClick={onButtonClick}
          className="bg-white text-black text-sm px-3 py-1 rounded-full font-medium hover:bg-gray-200 transition"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
