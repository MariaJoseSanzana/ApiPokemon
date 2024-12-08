// Lista de Pokémon (Base de datos en memoria)
const pokemons = [
  {
    id: 1,
    name: "Pikachu",
    type: "Electric",
    level: 12,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Charmander",
    type: "Fire",
    level: 8,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Squirtle",
    type: "Water",
    level: 5,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Bulbasaur",
    type: "Grass",
    level: 5,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Jigglypuff",
    type: "Fairy",
    level: 7,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Geodude",
    type: "Rock",
    level: 9,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "Eevee",
    type: "Normal",
    level: 12,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 8,
    name: "Gastly",
    type: "Ghost",
    level: 15,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 9,
    name: "Machop",
    type: "Fighting",
    level: 11,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 10,
    name: "Abra",
    type: "Psychic",
    level: 14,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 11,
    name: "Dratini",
    type: "Dragon",
    level: 18,
    trainerId: 1,
    createdAt: new Date(),
  },
  {
    id: 12,
    name: "Magikarp",
    type: "Water",
    level: 3,
    trainerId: 1,
    createdAt: new Date(),
  },
];

// Función para obtener todos los Pokémon
const getAllPokemons = () => {
  return pokemons;
};

// Función para obtener un Pokémon por ID
const getPokemonById = (id) => {
    const pokemon = pokemons.find((pokemon) => {
        return pokemon.id === Number(id);
    });
    return pokemon;
};

// Función para crear un nuevo Pokémon
const addPokemon = (pokemonData) => {
  const { name, type, level, trainerId } = pokemonData;

  // Validaciones más exhaustivas
  if (!name || !type || typeof level !== "number" || !trainerId) {
    throw new Error("Datos no válidos: se requieren nombre, tipo, nivel y ID de entrenador");
  }

  // Validar longitud del nombre
  if (name.length < 2 || name.length > 20) {
    throw new Error("El nombre del Pokémon debe tener entre 2 y 20 caracteres");
  }

  // Validar nivel
  if (level < 1 || level > 100) {
    throw new Error("El nivel debe estar entre 1 y 100");
  }

  // Verificar si ya existe un Pokémon con el mismo nombre y entrenador
  const existingPokemon = pokemons.find(
    (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase() && pokemon.trainerId === trainerId
  );

  if (existingPokemon) {
    throw new Error(
      `Pokémon con nombre "${name}" ya existe para el entrenador ${trainerId}`
    );
  }

  // Crear el nuevo Pokémon
  const newPokemon = {
    id: pokemons.length > 0 ? Math.max(...pokemons.map(p => p.id)) + 1 : 1,
    name,
    type,
    level,
    trainerId: Number(trainerId),
    createdAt: new Date(),
  };

  // Agregar el nuevo Pokémon a la lista
  pokemons.push(newPokemon);
  return newPokemon;
};

// Función para actualizar un Pokémon existente
const updatePokemon = (id, trainerId, updatedData) => {
  const pokemonIndex = pokemons.findIndex((pokemon) => 
    pokemon.id === id && pokemon.trainerId === trainerId
  );

  if (pokemonIndex === -1) {
    return null; // Pokémon no encontrado o no pertenece al entrenador
  }

  // Validaciones para los datos actualizados
  if (updatedData.name) {
    if (updatedData.name.length < 2 || updatedData.name.length > 20) {
      throw new Error("El nombre del Pokémon debe tener entre 2 y 20 caracteres");
    }
  }

  if (updatedData.level !== undefined) {
    if (updatedData.level < 1 || updatedData.level > 100) {
      throw new Error("El nivel debe estar entre 1 y 100");
    }
  }

  // Actualizar el Pokémon
  const updatedPokemon = {
    ...pokemons[pokemonIndex],
    ...updatedData,
    id,
  };

  pokemons[pokemonIndex] = updatedPokemon;
  return updatedPokemon;
};

// Función para eliminar un Pokémon
const deletePokemon = (id, trainerId) => {
  const pokemonIndex = pokemons.findIndex((pokemon) => 
    pokemon.id === id && pokemon.trainerId === trainerId
  );

  if (pokemonIndex === -1) {
    return null; // Pokémon no encontrado o no pertenece al entrenador
  }

  const deletedPokemon = pokemons.splice(pokemonIndex, 1)[0];
  return deletedPokemon;
};

// Función para obtener los Pokémon de un entrenador
const getPokemonsByTrainerId = (trainerId) => {
  return pokemons.filter(pokemon => pokemon.trainerId === trainerId);
};

module.exports = {
  getAllPokemons,
  getPokemonById,
  addPokemon,
  updatePokemon,
  deletePokemon,
  getPokemonsByTrainerId,
};
