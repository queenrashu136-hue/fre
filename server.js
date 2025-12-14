const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const HEROKU_API_KEY = process.env.HEROKU_API_KEY || "HRKU-AAZ6RT0zDGxYI2_H4JY9NeAWY_dRs9R-2jlPXpNdRY7g_____wMPPcKds0QC";

app.post("/deploy", async (req, res) => {
  const { appName, sessionId } = req.body;

  try {
    const response = await axios.post(
      "https://api.heroku.com/app-setups",
      {
        app: { name: appName },
        source_blob: {
          url: "https://github.com/queenrashu136-hue/jakerehukaka/tarball/main"
        },
        overrides: {
          env: {
            SESSION_ID: sessionId,
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HEROKU_API_KEY}`,
          Accept: "application/vnd.heroku+json; version=3"
        }
      }
    );

    res.json({ message: `ඔයාගෙ QUEEN RASHU MD Bot විනාඩි 3 ක් හෝ 5 ක කාලයක් ඇතුලත WhatsApp එකට Connect වෙයි හරිද 🤕 ඔයා මේ පහල තියෙන OK Button එක Click කරලා WhatsApp එකට එන්න❤️‍🩹\nhttps://dashboard.heroku.com/apps/${appName}` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Heroku deploy failed. Maybe app name already exists?" });
  }
});

app.delete("/delete", async (req, res) => {
  const { appName } = req.body;

  try {
    await axios.delete(`https://api.heroku.com/apps/${appName}`, {
      headers: {
        Authorization: `Bearer ${HEROKU_API_KEY}`,
        Accept: "application/vnd.heroku+json; version=3"
      }
    });

    res.json({ message: `App ${appName} deleted successfully ✅` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to delete app. Maybe app name doesn't exist?" });
  }
});

app.patch("/update-env", async (req, res) => {
  const { appName, sessionId } = req.body;

  try {
    const envVars = {};
    if (sessionId) envVars.SESSION_ID = sessionId;

    await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      envVars,
      {
        headers: {
          Authorization: `Bearer ${HEROKU_API_KEY}`,
          Accept: "application/vnd.heroku+json; version=3"
        }
      }
    );

    res.json({ message: `Environment variables for ${appName} updated successfully ✅` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to update environment variables. Maybe app name doesn't exist?" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

