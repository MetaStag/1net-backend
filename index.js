import express, { json } from 'express'; // backend library
import generateContract from './template/template.js';


// Run server on port 8080
const app = express();
const port = process.env.PORT || 8080;

// Use json for request/response
app.use(json());


// POST /api/generate endpoint
// recieves user input from frontend
app.post('/api/generate', (req, res) => {
    let { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Missing description field in request body.' });
    }
	
	// TODO: AI Layer to parse description intent
	description = { type: "Pausable", name: "PrimoCoin", supply: 1000000 }
	// Generate solidity template
	const template = generateContract(description)
	if (template === "false") {
		res.status(400).json({ "template": "Could not generate template" });
	}

	// return response
    res.status(200).json({ "template": template });
});

// Run the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
