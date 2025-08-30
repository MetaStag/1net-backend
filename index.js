import express, { json } from 'express'; // backend library
import generateContract from './template/template.js';
import compileWithHardhat from './compile/compile.js';

// logging
// better folder structure
// define solidity code in proper files with more code
// ai parsing layer

// Run server on port 8080
const app = express();
const port = process.env.PORT || 8080;

// Use json for request/response
app.use(json());


// POST /api/generate endpoint
// recieves user input from frontend
app.post('/api/generate', async (req, res) => {
    let { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Missing description field in request body.' });
    }
	
	// TODO: AI Layer to parse description intent
	description = { type: "ERC20", name: "PrimoCoin", supply: 1000 }

	// Generate solidity template
	const template = generateContract(description)
	if (template === "false") {
		res.status(400).json({ "template": "Could not generate template" });
	}

	// Compile the generated Solidity code
	const { abi, bytecode } = await compileWithHardhat(template, description.name);

	// return response
    res.status(200).json({ template, abi, bytecode });
});

// Run the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
