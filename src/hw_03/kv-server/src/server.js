import express from 'express';
import process from 'node:process';

const app = express();
const port = 3000;

const reddisLikeUrl = process.env.REDIS_URL;

app.use(express.json());
app.get('/kv/:key', async (req, res) => {
	const { key } = req.params;
	const response = await fetch(`${reddisLikeUrl}/get?key=${key}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		return res.status(200).json({ value: null });
	}
	const cached = await response.json();
	res.status(200).json(cached);
});
app.post('/kv', async (req, res) => {
	const body = req.body;
	const response = await fetch(`${reddisLikeUrl}/set`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		return res.status(200).json({ ok: false });
	}
	const result = await response.json();
	res.status(200).json(result);
});

app.listen(port, () => {
	console.log(`KV-server listening on http://localhost:8080`);
});
