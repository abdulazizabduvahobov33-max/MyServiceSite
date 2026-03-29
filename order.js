window.onload = () => {
  const project = localStorage.getItem('selectedProject');
  if (project) {
    document.getElementById('selectedProject').textContent =
      "Вы выбрали: " + project;
  }
};

async function sendOrder() {
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;
  const message = document.getElementById('message').value;
  const status = document.getElementById('status');

  const project = localStorage.getItem('selectedProject');

  if (!name || !contact || !message) {
    alert("Заполни все поля ❗");
    return;
  }

  status.textContent = "Отправка... ⏳";

  const order = { name, contact, message, project };

  try {
    const res = await fetch('http://localhost:3000/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    const data = await res.json();
    status.textContent = "Заявка отправлена ✅";
    localStorage.removeItem('selectedProject');
  } catch (err) {
    status.textContent = "Ошибка ❌";
    console.error(err);
  }
}