// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de Mercado Pago con tu token (guárdalo en .env)
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "TU_ACCESS_TOKEN"
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor Express funcionando con Mercado Pago");
});

// Crear preferencia de pago
app.post("/create_preference", async (req, res) => {
  try {
    const preference = {
      items: req.body.items, // productos enviados desde el frontend
      back_urls: {
        success: "http://localhost:5000/success",
        failure: "http://localhost:5000/failure",
        pending: "http://localhost:5000/pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas de retorno
app.get("/success", (req, res) => {
  res.send("✅ Pago exitoso. ¡Gracias por tu compra!");
});

app.get("/failure", (req, res) => {
  res.send("❌ El pago falló. Intenta nuevamente.");
});

app.get("/pending", (req, res) => {
  res.send("⏳ El pago está pendiente.");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
