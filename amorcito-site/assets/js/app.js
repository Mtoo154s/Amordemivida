const LoveApp = (() => {
  const KEY_AUTH = "love_auth_v1";
  const KEY_TRIES = "love_tries_v1";

  function setAuth(val){ localStorage.setItem(KEY_AUTH, val ? "1":"0"); }
  function isAuthed(){ return localStorage.getItem(KEY_AUTH) === "1"; }
  function logout(){ localStorage.removeItem(KEY_AUTH); }

  function normalize(s){
    return (s ?? "").toString().trim().toLowerCase();
  }

  function playAudio(audioId){
    const a = document.getElementById(audioId);
    if(!a) return;
    a.play().catch(()=>{ /* navegador bloquea hasta interacción */ });
  }
  function pauseAudio(audioId){
    const a = document.getElementById(audioId);
    if(!a) return;
    a.pause();
  }

  function initLoginPage(opts){
    const pass = document.getElementById(opts.passInputId);
    const btnLogin = document.getElementById(opts.loginBtnId);
    const btnMusic = document.getElementById(opts.startMusicBtnId);
    const msg = document.getElementById(opts.msgId);

    btnMusic.addEventListener("click", () => {
      msg.textContent = "🎶 Música activada (queda en loop)";
      playAudio(opts.audioId);
    });

    btnLogin.addEventListener("click", () => {
      const v = normalize(pass.value);
      if(v === opts.correctPass){
        setAuth(true);
        msg.textContent = "💗 Correcto, entrando…";
        setTimeout(()=> location.href = opts.next, 450);
      } else {
        msg.textContent = "❌ Contraseña incorrecta, intenta otra vez bb";
        pass.value = "";
        pass.focus();
      }
    });

    pass.addEventListener("keydown", (e) => {
      if(e.key === "Enter") btnLogin.click();
    });
  }

  function guardOrRedirect(current, login){
    if(!isAuthed()){
      location.href = login;
    }
  }

  function showLetter(el, html){
    el.classList.remove("hidden");
    el.innerHTML = html;
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function initSoloLock(opts){
    const pass = document.getElementById(opts.passInputId);
    const tryBtn = document.getElementById(opts.tryBtnId);
    const codeBtn = document.getElementById(opts.codeBtnId);
    const msg = document.getElementById(opts.msgId);
    const locked = document.getElementById(opts.lockedId);
    const unlocked = document.getElementById(opts.unlockedId);

    let tries = parseInt(localStorage.getItem(KEY_TRIES) || "0", 10);

    function updateUI(){
      if(tries >= opts.maxTries){
        codeBtn.classList.remove("hidden");
      }
    }

    codeBtn.addEventListener("click", () => {
      msg.textContent = "Para obtener esta clave hableme y digame que no pudo ingresar y yo la ayudare 💗";
    });

    tryBtn.addEventListener("click", () => {
      const v = normalize(pass.value);
      if(v === normalize(opts.correct)){
        msg.textContent = "✅ Desbloqueado 💖";
        localStorage.removeItem(KEY_TRIES);
        locked.classList.add("hidden");
        unlocked.classList.remove("hidden");
        return;
      }

      tries += 1;
      localStorage.setItem(KEY_TRIES, String(tries));
      const left = Math.max(0, opts.maxTries - tries);
      msg.textContent = `❌ Incorrecto. Te quedan ${left} intento(s).`;
      pass.value = "";
      pass.focus();
      updateUI();
    });

    pass.addEventListener("keydown", (e) => {
      if(e.key === "Enter") tryBtn.click();
    });

    updateUI();
  }

  // Canvas heart rain with words
  function initHeartRain({canvasId, words, finalWord}){
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const ctx = canvas.getContext("2d");

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    function resize(){
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    resize();
    window.addEventListener("resize", resize);

    const pick = () => words[Math.floor(Math.random()*words.length)];
    let spawnedFinal = false;

    const hearts = [];
    function spawn(){
      const isBigFinal = !spawnedFinal && Math.random() < 0.03; // chance de final
      if(isBigFinal) spawnedFinal = true;

      hearts.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        vy: 1.2 + Math.random()*2.2,
        size: isBigFinal ? 42 : 18 + Math.random()*14,
        text: isBigFinal ? finalWord : pick(),
        big: isBigFinal
      });
      if(hearts.length > 120) hearts.shift();
    }

    let last = 0;
    function loop(t){
      const dt = t - last; last = t;
      ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

      // spawn rate
      if(Math.random() < 0.35) spawn();

      hearts.forEach(h => {
        h.y += h.vy;
        ctx.font = `${h.big ? "900" : "700"} ${h.big ? 18 : 13}px system-ui, Arial`;
        ctx.globalAlpha = h.big ? 0.95 : 0.85;
        ctx.fillText("💗", h.x, h.y);
        ctx.globalAlpha = 0.95;
        ctx.fillText(h.text, h.x + (h.big ? 28 : 22), h.y + 2);
      });

      // remove offscreen
      for(let i=hearts.length-1;i>=0;i--){
        if(hearts[i].y > window.innerHeight + 60) hearts.splice(i,1);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  return {
    initLoginPage,
    guardOrRedirect,
    showLetter,
    initSoloLock,
    initHeartRain,
    playAudio,
    pauseAudio,
    logout
  };
})();
