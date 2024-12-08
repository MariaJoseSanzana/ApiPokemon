const jwt = require("jsonwebtoken");
const { addTrainer, loginTrainer } = require('../services/auth.services');

const registerTrainer = (req, res) => {
    try {
        const trainer = addTrainer(req.body);
        res.status(201).json({ message: "Entrenador registrado con éxito", trainer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({ error: "Credenciales requeridas" });
    }

    try {
        const token = loginTrainer(username, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};


const authValidation = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};

module.exports = { authValidation, registerTrainer, login };


