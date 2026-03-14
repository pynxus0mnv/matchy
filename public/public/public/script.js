const socket = io();

function start() {
  const gender = document.getElementById("gender").value;
  const match = document.getElementById("match").value;
  socket.emit("start", { gender, match });
}

socket.on("matched", () => {
  document.getElementById("setup").style.display = "none";
  document.getElementById("chat").style.display = "block";
  addMessage("✅ Connected to a stranger!");
});

function send() {
  const msgInput = document.getElementById("msg");
  const msg = msgInput.value;
  if (!msg) return;
  socket.emit("msg", msg);
  addMessage("You: " + msg);
  msgInput.value = "";
}

socket.on("msg", (msg) => {
  addMessage("Stranger: " + msg);
});

function skip() {
  addMessage("⏭ Skipped! Waiting for a new stranger...");
  socket.emit("start", {
    gender: document.getElementById("gender").value,
    match: document.getElementById("match").value
  });
}

function addMessage(msg) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.innerText = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
