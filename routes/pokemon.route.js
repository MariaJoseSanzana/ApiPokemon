const express = require('express');
const router = express.Router();
const { 
    getAllPokemons, 
    getPokemonById, 
    getMyPokemons, 
    createPokemon, 
    updatePokemon, 
    deletePokemon 
} = require('../controllers/pokemon.controller');
const { authValidation } = require('../controllers/auth.controller');

router.get('/', getAllPokemons);
router.get('/trainer/mypokemons', authValidation, getMyPokemons); //ruta protegida
router.get('/:id', getPokemonById);

router.post('/', authValidation, createPokemon); //ruta protegida
router.put('/:id', authValidation, updatePokemon); //ruta protegida
router.delete('/:id', authValidation, deletePokemon); //ruta protegida

module.exports = router;