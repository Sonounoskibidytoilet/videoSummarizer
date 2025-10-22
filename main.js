// main.js

// Inserisci qui il tuo token Hugging Face
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

// URL del modello di riassunto (gratuito e affidabile)
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

document.getElementById("generate").addEventListener("click", async () => {
  const input = document.getElementById("videoName");
  const resultBox = document.getElementById("result");
  const videoName = input.value.trim();

  if (!videoName) {
    resultBox.textContent = "Scrivi il nome o il link del video prima di continuare.";
    return;
  }

  resultBox.textContent = "⏳ Sto generando il riassunto...";

  try {
    // Per ora prendiamo solo il testo scritto, in futuro potrai aggiungere l’estrazione da YouTube
    const testoDaRiassumere = `Titolo del video: ${videoName}`;

    const response = await fetch(MODEL_URL, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: testoDaRiassumere }),
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0] && data[0].summary_text) {
      resultBox.textContent = `🎬 Riassunto: ${data[0].summary_text}`;
    } else {
      resultBox.textContent = "Nessun riassunto trovato, riprova.";
    }
  } catch (error) {
    console.error(error);
    resultBox.textContent = "❌ Errore nella generazione del riassunto.";
  }
});
