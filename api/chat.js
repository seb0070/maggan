export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.ennoia.so/api/preset/v2/chat/completions",
      {
        method: "POST",
        headers: {
          project: process.env.ENNOIA_PROJECT,
          apiKey: process.env.ENNOIA_API_KEY,
          "X-ENNOIA-USER-ID": process.env.ENNOIA_USER_ID,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("BODY:", text);

    return res.status(response.status).send(text);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}