import express from 'express';
import mongoose from 'mongoose';
import ShortUrl from './models/short_url.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3301;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/url-shortener');

app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const shortUrl = await ShortUrl.create({ full: url });
    res.json(shortUrl);
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
});

app.get('/api/recent-urls', async (req, res) => {
  try {
    const recentUrls = await ShortUrl.find().sort({ createdAt: -1 })
    res.json(recentUrls);
  } catch (error) {
    console.error('Error fetching recent URLs:', error);
    res.status(500).json({ error: 'Failed to fetch recent URLs' });
  }
});


// redirect all the short urls =>
app.get('/:short_url', async (req, res) => {
    const { short_url } = req.params;
    const url = await ShortUrl.findOne({ short: short_url });
    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(url.full);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
