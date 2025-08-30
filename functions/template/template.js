// Load contract templates from templates.json
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to interpolate template string with variables
function interpolate(template, vars) {
	return template.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

/**
 * Generates Solidity smart contract code based on input JSON.
 * @param {Object} description - { type: string, name: string, supply?: number }
 * @returns {string} Solidity contract code as a string (or false if error)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getTemplateSource(type) {
	const templateFiles = {
		erc20: path.join(__dirname, 'erc20.sol'),
		erc721: path.join(__dirname, 'erc721.sol'),
		pausable: path.join(__dirname, 'pausable.sol'),
	};
	const filePath = templateFiles[type];
	if (!filePath) {
		return null;
	}
	try {
		return await readFile(filePath, 'utf8');
	} catch {
		return null;
	}
}

export default async function generateContract(description) {
	const { type, name, supply } = description;
	const contractName = name ? name.replace(/\s+/g, '') : 'MyContract';
	const templateSource = await getTemplateSource(type);
	if (!templateSource) {
		return "false";
	}
	return interpolate(templateSource, { name, contractName, supply });
}