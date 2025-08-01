
import { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Card, Container } from "@mui/material";
import { generateShortcode, isValidURL, isAlphanumeric } from "../utils/helpers";
import { logger } from "../middleware/logger";

const Home = () => {
  const [entries, setEntries] = useState(Array(5).fill({ longURL: "", validity: "", shortcode: "" }));
  const [messages, setMessages] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const shortenURLs = () => {
    const output = [];
    const currentData = JSON.parse(localStorage.getItem("urlData") || "{}");

    entries.forEach(({ longURL, validity, shortcode }, i) => {
      if (!longURL.trim()) return;

      if (!isValidURL(longURL)) {
        setMessages((prev) => [...prev, `Row ${i + 1}: Invalid URL`]);
        return;
      }

      let code = shortcode?.trim() || generateShortcode();

      if (shortcode && (!isAlphanumeric(code) || code.length > 10)) {
        setMessages((prev) => [...prev, `Row ${i + 1}: Invalid shortcode`]);
        return;
      }

      if (currentData[code]) {
        setMessages((prev) => [...prev, `Row ${i + 1}: Shortcode already exists`]);
        return;
      }

      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + (validity ? parseInt(validity) : 30) * 60000);

      currentData[code] = {
        longURL,
        createdAt,
        expiresAt,
        clicks: [],
      };

      logger("URL_SHORTENED", { shortcode: code, longURL });
      output.push(`Row ${i + 1}: Shortened as http://localhost:3000/${code}`);
    });

    localStorage.setItem("urlData", JSON.stringify(currentData));
    setMessages(output);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>URL Shortener</Typography>
        {entries.map((entry, i) => (
          <Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }} key={i}>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>Entry {i + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Long URL" value={entry.longURL}
                  onChange={(e) => handleChange(i, "longURL", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Validity (mins)" value={entry.validity}
                  onChange={(e) => handleChange(i, "validity", e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Custom Shortcode (opt)" value={entry.shortcode}
                  onChange={(e) => handleChange(i, "shortcode", e.target.value)} />
              </Grid>
            </Grid>
          </Card>
        ))}
        <Button variant="contained" color="primary" onClick={shortenURLs}>Shorten URLs</Button>
        <div style={{ marginTop: 20 }}>
          {messages.map((msg, i) => (
            <Typography key={i}>{msg}</Typography>
          ))}
        </div>
      </Paper>
    </Container>
  );
};

export default Home;
