// app.js
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', message);
    messageInput.value = '';
  } 
};

sendButton.addEventListener('click', sendMessage);


messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = data.message;

  // Agregar clase "message" común
  messageElement.classList.add('message');

  // Comparar el socket.id del cliente con el senderId del mensaje recibido
  if (data.senderId === socket.id) {
    // Si el mensaje es enviado por el propio usuario
    messageElement.classList.add('sent');
  } else {
    // Si el mensaje es recibido de otro usuario
    messageElement.classList.add('received');
  }
  messages.appendChild(messageElement);

  messages.scrollTop = messages.scrollHeight;
});
