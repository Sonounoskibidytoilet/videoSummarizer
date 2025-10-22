import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Metti qui il tuo URL e la publishable key
const supabaseUrl = 'https://kowetlzcfhiacmqtobmk.supabase.co';
const supabaseKey = 'sb_publishable_UYZOq6sYNjxGmkMBNQJJ9A_7VZ22lqn'; // INCOLLA QUI la Publishable key (non la secret)
const supabase = createClient(supabaseUrl, supabaseKey);

// Test di connessione: legge 1 riga dalla tabella summaries
async function testConnection() {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Errore Supabase:', error);
    alert('Errore di connessione. Controlla console.');
    return;
  }
  console.log('Connessione OK, sample data:', data);
  alert('Connessione a Supabase OK (controlla console)');
}

document.getElementById('generate').addEventListener('click', async () => {
  const videoName = document.getElementById('videoName').value;
  if (!videoName) return alert('Scrivi il nome del video.');

  // qui metti la tua funzione per generare il riassunto (IA)
  const summary = `Riassunto di prova per "${videoName}"`;

  const { data, error } = await supabase
    .from('summaries')
    .insert([{ video_name: videoName, summary }]);

  if (error) {
    console.error('Errore salvataggio:', error);
    alert('Errore nel salvataggio (vedi console)');
    return;
  }

  document.getElementById('result').textContent = summary;
});
