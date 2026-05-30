/* Fetch e parsing data.json — unica fonte di verità */
let appData = null;

async function loadData() {
  const res = await fetch(`./data.json?v=${Date.now()}`);
  if (!res.ok) throw new Error(`Fetch data.json fallito: ${res.status}`);
  appData = await res.json();
  return appData;
}

export { loadData, appData };
