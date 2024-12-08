// controllers/pokemon.controller.js
const pokemonService = require('../services/pokemon.services');

// Obtener todos los Pokémon registrados
exports.getAllPokemons = async (req, res) => {
    try {
        const pokemonList = pokemonService.getAllPokemons();
        res.status(200).json({
            message: "Pokémones obtenidos exitosamente",
            pokemons: pokemonList,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener Pokémones",
            details: error.message,
        });
    }
};

// Detalle de un Pokémon específico
exports.getPokemonById = async (req, res) => {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID inválido",
            details: "El ID proporcionado no es un número válido",
            rawId: req.params.id,
        });
    }
    
    try {
        const pokemon = pokemonService.getPokemonById(id);
        
        if (!pokemon) {
            return res.status(404).json({
                error: "Pokemon no encontrado",
                details: `No se encontró Pokémon con ID ${id}`,
            });
        }
        
        res.status(200).json({ pokemon });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener detalles de Pokémon",
            details: error.message,
        });
    }
};

// Obtener los Pokémon de un entrenador autenticado
exports.getMyPokemons = async (req, res) => {
    const trainerId = req.user.externalId;
    
    if (!trainerId) {
        return res.status(400).json({ error: "ID de entrenador no encontrado" });
    }
    
    try {
        const myPokemons = pokemonService.getPokemonsByTrainerId(trainerId);
        
        if (myPokemons.length === 0) {
            return res.status(404).json({ message: "No tienes Pokémon registrados" });
        }
        
        res.status(200).json({ pokemons: myPokemons });
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener Pokémon del entrenador",
            details: error.message,
        });
    }
};

// Registrar un nuevo Pokémon (protegido)
exports.createPokemon = async (req, res) => {
    const { name, type, level } = req.body;
    let trainerId = req.user.externalId; 

    trainerId = Number(trainerId);
    
    // Validación de campos
    if (!name || !type || !level) {
        return res.status(400).json({ error: "Campos faltantes" });
    }
    
    try {
        const newPokemon = pokemonService.addPokemon({
            name,
            type,
            level,
            trainerId,
        });
        
        res.status(201).json({
            message: "Pokemon registrado exitosamente",
            pokemon: newPokemon,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al registrar Pokémon",
            details: error.message,
        });
    }
};

// Actualizar un Pokémon (protegido)
exports.updatePokemon = async (req, res) => {
    const id = Number(req.params.id);
    const trainerId = Number(req.user.externalId);  // Aseguramos que es un número
    const { name, type, level } = req.body;
    
    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID inválido",
            details: "El ID proporcionado no es un número válido",
        });
    }
    
    try {
        const pokemon = await pokemonService.getPokemonById(id);

        // Verificar si el Pokémon existe y si el entrenador es el dueño
        if (!pokemon || pokemon.trainerId !== trainerId) {  // Comparamos con trainerId en lugar de externalId
            return res.status(403).json({
                error: "No autorizado",
                details: `No se puede actualizar el Pokémon con ID ${id} porque no le pertenece`,
            });
        }
        
        const updatedPokemon = await pokemonService.updatePokemon(id, trainerId, {
            name,
            type,
            level,
        });
        
        if (!updatedPokemon) {
            return res.status(404).json({
                error: "Pokemon no encontrado o no autorizado",
                details: `No se pudo actualizar el Pokémon con ID ${id}`,
            });
        }
        
        res.status(200).json({
            message: "Pokemon actualizado exitosamente",
            pokemon: updatedPokemon,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar Pokémon",
            details: error.message,
        });
    }
};


// Eliminar un Pokémon (protegido)
exports.deletePokemon = async (req, res) => {
    const id = Number(req.params.id);
    const trainerId = Number(req.user.externalId); // Aseguramos que es un número
    
    if (isNaN(id)) {
        return res.status(400).json({
            error: "ID inválido",
            details: "El ID proporcionado no es un número válido",
        });
    }

    try {
        // Buscar el Pokémon por su ID
        const pokemon = await pokemonService.getPokemonById(id);
        console.log("Pokemon encontrado:", pokemon);
        console.log("ID del entrenador autenticado (trainerId):", trainerId);

        // Verificar si el Pokémon existe y si el entrenador es el dueño
        if (!pokemon || pokemon.trainerId !== trainerId) {  // Comparamos con trainerId en lugar de externalId
            return res.status(403).json({
                error: "No autorizado",
                details: `No se puede eliminar el Pokémon con ID ${id} porque no le pertenece`,
            });
        }

        // Si pasa la validación, elimina el Pokémon
        const deletedPokemon = await pokemonService.deletePokemon(id, trainerId);

        res.status(200).json({
            message: "Pokémon eliminado exitosamente",
            pokemon: deletedPokemon,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar Pokémon",
            details: error.message,
        });
    }
};