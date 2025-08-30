import fs from 'fs';
import path from 'path';

// Load contract templates from templates.json
const templatesPath = path.join(__dirname, 'templates.json');
const contractTemplates = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));

// Helper to interpolate template string with variables
function interpolate(template, vars) {
	return template.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

/**
 * Generates Solidity smart contract code based on input JSON.
 * @param {Object} description - { type: string, name: string, supply?: number }
 * @returns {string} Solidity contract code as a string (or false if error)
 */

function generateContract(description) {
	const { type, name, supply } = description;
	const contractName = name ? name.replace(/\s+/g, '') : 'MyContract';
	const template = contractTemplates[type];
	if (!template) {
		return "false";
	}
	const importStatements = template.import.map(i => `import '${i}';`).join('\n');
	const contractBody = interpolate(template.body, { name, contractName, supply });
	return `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n${importStatements}\n\n${contractBody}`;
}

export default generateContract;