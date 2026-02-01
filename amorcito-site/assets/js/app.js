// ===== APP PRINCIPAL =====
const LoveApp = (() => {

  const AUTH_KEY = "love_auth";

  const login = () => localStorage.setItem(AUTH_KEY, "1");
  const logout = () => localStorage.removeItem(AUTH_KEY);
  const isLogged = () => localStorage.getItem(AUTH_KEY) === "1";

  /* ===== LOGIN INICIAL ===== */
  function initLogin() {
    const btn = document.getElementById("btnLogin");
    const input = document.getElementById("pass1");
    const msg = document.getElementById("msg");
    const audio = document.getElementById("introAudio");

    btn.addEventListener("click", () => {
      if (input.value === "16-04-25") {
        login();
        msg.textContent = "💗 Correcto bb...";
        audio.play().catch(()=>{});
        setTimeout(() => location.href = "home.html", 700);
      } else {
        msg.textContent = "❌ Contraseña incorrecta";
      }
    });
  }

  /* ===== PROTECCIÓN DE PÁGINAS ===== */
  function protect() {
    if (!isLogged()) location.href = "index.html";
  }

  /* ===== SOLO PARA USTED ===== */
  function initSecret() {
    const input = document.getElementById("pass2");
    const btn = document.getElementById("try");
    const msg = document.getElementById("msg2");
    const locked = document.getElementById("locked");
    const unlocked = document.getElementById("unlocked");
    let tries = 0;

    btn.addEventListener("click", () => {
      if (input.value.toLowerCase() === "te amo") {
        locked.style.display = "none";
        unlocked.style.display = "block";
      } else {
        tries++;
        msg.textContent = `❌ Incorrecto (${3 - tries} intentos restantes)`;
        if (tries >= 3) {
          msg.textContent = "🔒 Para obtener esta clave hableme y digame que no pudo ingresar y yo la ayudare";
        }
      }
    });
  }

  return {
    initLogin,
    protect,
    initSecret,
    logout
  };
})();

