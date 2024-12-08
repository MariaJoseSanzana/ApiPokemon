require('dotenv').config();
const express = require('express');
const { registerTrainer, login } = require('./controllers/auth.controller');
const pokemonRoutes = require('./routes/pokemon.route');

const app = express();
app.use(express.json());

// Rutas de autenticación
app.post('/auth/register', registerTrainer);
app.post('/auth/login', login);

// Rutas de Pokémon
app.use('/pokemon', pokemonRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});