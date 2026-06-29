const BASE = "https://api.football-data.org/v4/competitions/WC";

export default async (req, context) => {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing FOOTBALL_DATA_KEY" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
  const headers = { "X-Auth-Token": key };
  try {
    const [matches, standings, scorers] = await Promise.all([
      fetch(`${BASE}/matches`, { headers }).then((r) => r.json()),
      fetch(`${BASE}/standings`, { headers }).then((r) => r.json()),
      fetch(`${BASE}/scorers?limit=10`, { headers }).then((r) => r.json()),
    ]);
    return new Response(JSON.stringify({ matches, standings, scorers }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502, headers: { "Content-Type": "application/json" },
    });
  }
};
