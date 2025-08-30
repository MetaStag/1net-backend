import express, { json } from 'express'; // backend library


// Run server on port 8080
const app = express();
const port = process.env.PORT || 8080;

// Use json for request/response
app.use(json());


// POST /generate endpoint
// recieves user input from frontend
app.post('/generate', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Missing description field in request body.' });
    }
    res.json({ message: `Received description: ${description}` });
});

// Run the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
