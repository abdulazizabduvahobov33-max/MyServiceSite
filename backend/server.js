// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// Твои данные Telegram
const TELEGRAM_TOKEN = '8634135578:AAGXAR1Yl60M84VeaQPRqVQwDke4otntzm8';
const CHAT_ID = '5530817690';

// Получить все заказы (для проверки)
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Добавить новый заказ
app.post('/order', async (req, res) => {
  const { name, contact, message, project } = req.body;

  if (!name || !contact || !message) {
    return res.status(400).json({ message: "Заполни все поля ❗" });
  }

  const order = {
    id: Date.now(),
    name,
    contact,
    message,
    project: project || "Не выбран"
  };

  orders.push(order);

  console.log("🔥 Новый заказ:", order);

  // Текст для Telegram
  const text = `
💌 Новый заказ!
Имя: ${order.name}
Контакт: ${order.contact}
Проект: ${order.project}
Сообщение: ${order.message}
  `;

  try {
    // В Node 18+ fetch встроен, require node-fetch больше не нужен
    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (!telegramRes.ok) {
      throw new Error(`Telegram API error: ${telegramRes.status}`);
    }

    res.json({ message: "Заявка отправлена ✅" });
  } catch (err) {
    console.error("Ошибка отправки Telegram:", err);
    res.status(500).json({ message: "Заявка принята, но Telegram не отправлен ❌" });
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});