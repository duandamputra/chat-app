/*
- is typing
- attachement
- scroll new message
- markdown support
- emoji
*/

const socket = new WebSocket("ws://192.168.1.11:8999");
const btnSend = document.querySelector(".btn-send");
const textArea = document.querySelector(".text-input");
const bubbleContainer = document.querySelector(".bubble-container");

socket.addEventListener("open", () => {
  const name = prompt("Whats your name?");
  socket.send(
    JSON.stringify({
      initial: true,
      name: name,
    })
  );
});

textArea.addEventListener("keydown", (event) => {
  if (!event.shiftKey && event.code === "Enter") {
    event.preventDefault();
    sendMessages();
  }
  textArea.style.height = "auto";
  textArea.style.height = textArea.scrollHeight + "px";
});

function sendMessages() {
  socket.send(
    JSON.stringify({
      initial: false,
      message: textArea.value,
    })
  );
  textArea.value = "";
}

btnSend.addEventListener("click", () => {
  sendMessages();
});

socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
  if (event.data instanceof Blob) {
    event.data.text().then((result) => {
      console.log(result);
    });
  } else {
    console.log(event.data);
  }
  const data = JSON.parse(event.data);
  renderBubble(data);
});

const renderBubble = (data) => {
  const bubble = document.createElement("div");

  bubble.innerHTML = `
<div class="bubble-message" style="background: ${stringToColor(data.user.id)}">${data.message}</div>
<div class="bubble-name">${data.user.name}</div>
`;

  bubble.className = "bubble " + (data.me ? "bubble-out" : "bubble-in");
  bubbleContainer.append(bubble);
};

function stringToColor(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}
