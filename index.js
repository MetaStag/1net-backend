import express, { json } from 'express'; // backend library
import logger from './functions/logging/logger.js'; // logging
import generateContract from './functions/template/template.js'
import compileWithHardhat from './functions/compile/compile.js';

// ai parsing layer

// Run server on port 8080
const app = express();
const port = process.env.PORT || 8080;

// Use json for request/response
app.use(json());


// POST /api/generate endpoint
// recieves user input from frontend
app.post('/api/generate', async (req, res) => {
	// Check if user input exists
    let { description } = req.body;
    if (!description) {
		logger('/api/generate/ - Missing description field in request body.');
        return res.status(400).json({ error: 'Missing description field in request body.' });
    }
	
	// TODO: AI Layer to parse description intent
	description = { type: "erc20", name: "PrimoCoin", supply: 1000 }

	// Generate solidity template
	const template = await generateContract(description)
	if (template === "false") {
		logger('/api/generate/ - Could not generate template');
		res.status(400).json({ error: "Could not generate template" });
	}

	// Compile the generated Solidity code
	try {
		const { abi, bytecode } = await compileWithHardhat(template, description.name);

		// return response
		logger('/api/generate/ - Successfully generated and compiled contract.');
		res.status(200).json({ template, abi, bytecode });

	} catch (error) {
		logger(`/api/generate/ - Compilation failed: ${error.message}`);
		res.status(400).json({ error: 'Contract compilation failed'});
	}
});

// Run the server
app.listen(port, () => {
    logger(`Server running on port ${port}`);
});
