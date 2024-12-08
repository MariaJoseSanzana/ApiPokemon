const express = require('express');
const router = express.Router();
const { authValidation, login, registerTrainer } = require('../controllers/auth.controller');
const { getMyPokemons } = require('../controllers/pokemon.controller');

router.post('/auth/register', registerTrainer);
router.post('/auth/login', login);
router.get('/trainer/mypokemons', authValidation, getMyPokemons);

module.exports = router;

