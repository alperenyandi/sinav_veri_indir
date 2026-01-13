const codeInput = document.getElementById("codeInput");
const downloadBtn = document.getElementById("downloadBtn");
const msg = document.getElementById("msg");

const VALID_CODES = new Set(["001","002","003","004","005","006","007"]);

// Repo adıyla Pages yayınında base path gerekir: /sinav_veri_indir/
const BASE = window.location.pathname.replace(/\/[^/]*$/, "/");

function normalizeCode(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  const n = Number(digits);
  if (Number.isFinite(n) && n >= 1 && n <= 7) return String(n).padStart(3, "0");
  if (digits.length >= 3) return digits.slice(0, 3);
  return digits;
}

function setMsg(text, ok = true) {
  msg.textContent = text;
  msg.style.color = ok ? "#0b6b2a" : "#b00020";
}

function getUrls(code) {
  const n = Number(code);        // 001 -> 1
  const setFolder = `SET${n}`;   // -> SET1
  const baseName = `S${n}`;      // -> S1
  return [
    `${BASE}${setFolder}/${baseName}.docx`,
    `${BASE}${setFolder}/${baseName}.sav`
  ];
}

function triggerDownload(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function startDownloads() {
  const code = normalizeCode(codeInput.value.trim());
  codeInput.value = code;

  if (!VALID_CODES.has(code)) {
    setMsg("Kod geçersiz. Lütfen 001–007 aralığında bir kod girin.", false);
    return;
  }

  const [wordUrl, spssUrl] = getUrls(code);

  downloadBtn.disabled = true;
  setMsg(`İndirme başlatılıyor: ${code} ...`);

  // Dosya var mı hızlı kontrol (başarısız olsa bile yine indirmeyi dener)
  try { await fetch(wordUrl, { method: "HEAD" }); } catch (e) {}
  try { await fetch(spssUrl, { method: "HEAD" }); } catch (e) {}

  triggerDownload(wordUrl);
  setTimeout(() => triggerDownload(spssUrl), 700);

  setMsg("İndirme isteği gönderildi. İzin uyarısı çıkarsa onaylayın.");
  downloadBtn.disabled = false;
}

downloadBtn.addEventListener("click", startDownloads);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startDownloads();
});
