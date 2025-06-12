// services/back4app.js

import Parse from "parse";

// Inicializa a conexão
Parse.initialize(
  "eKE9rFKvZrh7WK9G4G9FHfMiWWuvnoFmHaD355pX",
  "DKCvK174Bg7jNkR04uECBxQheZcBxyF4hBX5kJZS"
);
Parse.serverURL = "https://parseapi.back4app.com/";

console.log("Módulo de conexão do Back4App carregado.");

// Exporta o objeto Parse já configurado para ser usado em qualquer lugar
export default Parse;
