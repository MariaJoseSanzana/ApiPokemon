const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Listas de usuarios y entrenadores
const users = [
    {
        id: 1,
        externalId: 1,
        username: "admin",
        password: "$2b$10$spdKB/pIAukK5TGhMM8z6uZEbPKnlx1Nj4/kv24FPJVfoSHqNy/GK",
        role: "trainer",
    },
];

const trainers = [];

const addTrainer = (trainerData) => {
    const { username, password, trainerName } = trainerData;

    // Validaciones
    if (!username || !password || !trainerName) {
        throw new Error("Todos los campos son obligatorios");
    }
    if (username.length < 3 || username.length > 20) {
        throw new Error("El nombre de usuario debe tener entre 3 y 20 caracteres");
    }
    if (trainerName.length < 2 || trainerName.length > 30) {
        throw new Error("El nombre de entrenador debe tener entre 2 y 30 caracteres");
    }

    const existingTrainer = trainers.find(
        (trainer) => trainer.username === username || trainer.trainerName === trainerName
    );
    if (existingTrainer) {
        throw new Error("El nombre de usuario o de entrenador ya está en uso");
    }

    // Crear nuevo entrenador
    const newTrainer = {
        id: trainers.length > 0 ? Math.max(...trainers.map((t) => t.id)) + 1 : 1,
        username,
        trainerName,
        password: bcrypt.hashSync(password, 10),
        externalId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
    };

    trainers.push(newTrainer);
    return newTrainer;
};

const loginTrainer = (username, password) => {
    const user = [...users, ...trainers].find((u) => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
        {
            id: user.id, 
            username: user.username,
            role: user.role || "trainer",
            externalId: user.externalId,
        },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
    );

    return token;
};

module.exports = {
    addTrainer,
    loginTrainer,
    trainers,
};