
import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Container } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const Stats = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("urlData") || "{}"));
  }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>Statistics</Typography>
        {Object.entries(data).map(([code, details]) => (
          <Paper key={code} sx={{ padding: 2, marginY: 2 }}>
            <Typography variant="h6">
              Short URL: <a href={`/${code}`}>{`http://localhost:3000/${code}`}</a>
            </Typography>
            <QRCodeCanvas value={`http://localhost:3000/${code}`} size={128} />
            <Typography>Original URL: {details.longURL}</Typography>
            <Typography>Created: {new Date(details.createdAt).toLocaleString()}</Typography>
            <Typography>Expires: {new Date(details.expiresAt).toLocaleString()}</Typography>
            <Typography>Total Clicks: {details.clicks.length}</Typography>
            <List dense>
              {details.clicks.map((click, i) => (
                <ListItem key={i}>
                  <ListItemText primary={`Clicked at ${click.time} from ${click.location}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default Stats;
