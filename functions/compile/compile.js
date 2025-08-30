import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

/**
 * Compiles Solidity code using Hardhat and returns ABI and bytecode.
 * @param {string} sourceCode - Solidity source code
 * @param {string} contractName - Name of the contract to extract
 * @returns {Promise<{ abi: any, bytecode: string }>}
 */
export default async function compileWithHardhat(sourceCode, contractName) {
	// Write source to a temp file in contracts/
	const contractsDir = path.resolve('./functions/contracts');
	const tempFile = path.join(contractsDir, 'TempContract.sol');
	await fs.writeFile(tempFile, sourceCode, 'utf8');

	console.log(path.resolve('.'))

	// Run Hardhat compile
	await new Promise((resolve, reject) => {
		exec('npx hardhat compile', { cwd: path.resolve('.') }, (err, stdout, stderr) => {
			if (err) {
				reject(new Error(stderr || stdout));
			} else {
				resolve(stdout);
			}
		});
	});

	// Read artifact
	const artifactPath = path.resolve('./artifacts/functions/contracts/TempContract.sol/', contractName + '.json');
	const artifact = JSON.parse(await fs.readFile(artifactPath, 'utf8'));
	return {
		abi: artifact.abi,
		bytecode: artifact.bytecode
	};
}
