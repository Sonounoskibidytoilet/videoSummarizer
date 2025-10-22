const button = document.getElementById("generate");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const videoUrl = document.getElementById("videoUrl").value.trim();
  if (!videoUrl) {
    result.textContent = "Inserisci un link YouTube valido.";
    return;
  }

  result.textContent = "⏳ Recupero i sottotitoli...";

  try {
    // 1️⃣ Estrae i sottotitoli
    const transcriptRes = await fetch(
      `https://yt.lemnoslife.com/videos?part=transcript&id=${getVideoId(videoUrl)}`
    );
    const data = await transcriptRes.json();

    if (!data.items || !data.items[0].transcript?.transcript) {
      result.textContent = "❌ Nessun sottotitolo trovato.";
      return;
    }

    const transcriptText = data.items[0].transcript.transcript
      .map(t => t.text)
      .join(" ");

    result.textContent = "✍️ Creo il riassunto...";

    // 2️⃣ Riassume con Hugging Face
    const summaryRes = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer hf_FakeTokenQui", // <-- ti spiego sotto
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: transcriptText.slice(0, 2000) })
      }
    );

    const summaryData = await summaryRes.json();
    const summary = summaryData[0]?.summary_text || "Errore nel riassunto.";

    result.textContent = summary;
  } catch (err) {
    console.error(err);
    result.textContent = "⚠️ Errore durante il riassunto.";
  }
});

function getVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
