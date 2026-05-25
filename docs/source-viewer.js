const allowedPrefix = "artifacts/";
const params = new URLSearchParams(window.location.search);
const file = params.get("file") || "";
const title = document.getElementById("source-title");
const path = document.getElementById("source-path");
const code = document.getElementById("source-code");

function showError(message) {
  title.textContent = "Файл не открыт";
  path.textContent = "";
  code.textContent = message;
}

if (!file.startsWith(allowedPrefix) || file.includes("..")) {
  showError("Недопустимый путь к артефакту.");
} else {
  title.textContent = file.split("/").pop();
  path.textContent = file;
  fetch(`./${file}`, { headers: { Accept: "text/plain; charset=utf-8" } })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => {
      code.textContent = text;
    })
    .catch((error) => {
      showError(`Не удалось загрузить файл: ${error.message}`);
    });
}
