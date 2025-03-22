require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "supersecreto";

// Datos falsos de usuario
const USER_FAKE = {
  email: "gael@gmail.com",
  password: "pass123",
};

// Ruta pública
app.get("/", (req, res) => {
  res.json({ message: "Demo APP NGROK" });
});

// Endpoint de login
app.post("/auth", (req, res) => {
  const { email, password } = req.body;
    console.log(req.body);
  // Validación contra datos falsos
  if (email !=  USER_FAKE.email || password != USER_FAKE.password) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  // Generar token JWT
  const token = jwt.sign({ username: USER_FAKE.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  const dataResponse = {
    user: USER_FAKE.email,
    token,
  };

  res.json({ message: "Inicio de sesión exitoso", data: dataResponse });
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.user = decoded;
    next();
  });
};

// Ruta protegida
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Acceso autorizado", user: req.user });
});

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
