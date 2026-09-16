// @ts-nocheck
import hre from "hardhat";

async function main() {
  console.log("Deploying ProoflyRegistry to Base Sepolia...");

  const ProoflyRegistry = await hre.ethers.getContractFactory("ProoflyRegistry");
  const registry = await ProoflyRegistry.deploy();

  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log(`ProoflyRegistry deployed to: ${address}`);
  console.log(`\nNext Steps:`);
  console.log(`1. Copy the address: ${address}`);
  console.log(`2. Update PROOFLY_REGISTRY_ADDRESS in 'lib/blockchain/contract.ts' with this address.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
