import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Load contract ABI
const contractJson = JSON.parse(
  fs.readFileSync("./artifacts/contracts/CampusCredit.sol/CampusCredit.json", "utf8")
);

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = Number(process.env.CHAIN_ID);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

const FROM_ADDRESS = process.env.FROM_ADDRESS.toLowerCase();
const TO_ADDRESS = process.env.TO_ADDRESS.toLowerCase();

async function main() {
  // account & clients
  const account = privateKeyToAccount(PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: { id: CHAIN_ID, name: "Local Hardhat", rpcUrls: { default: { http: [RPC_URL] } } },
    transport: http(RPC_URL)
  });

  const publicClient = createPublicClient({
    chain: { id: CHAIN_ID, name: "Local Hardhat", rpcUrls: { default: { http: [RPC_URL] } } },
    transport: http(RPC_URL)
  });

  console.log("=== Balances Before ===");
  let fromBal = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "balanceOf",
    args: [FROM_ADDRESS]
  });

  let toBal = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "balanceOf",
    args: [TO_ADDRESS]
  });

  console.log(`From: ${fromBal} CAMP`);
  console.log(`To: ${toBal} CAMP`);

  // === Transfer ===
  console.log("\n=== Transfer ===");
  const amount = parseUnits("100", 18); // ✅ fixed

  const txHash1 = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "transfer",
    args: [TO_ADDRESS, amount]
  });

  console.log(`Transfer Tx Hash: ${txHash1}`);

  fromBal = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "balanceOf",
    args: [FROM_ADDRESS]
  });

  toBal = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "balanceOf",
    args: [TO_ADDRESS]
  });

  console.log(`Balances After Transfer:`);
  console.log(`From: ${fromBal} CAMP`);
  console.log(`To: ${toBal} CAMP`);

  // === Approve ===
  console.log("\n=== Approve ===");
  const approveAmount = parseUnits("50", 18); // ✅ fixed

  const txHash2 = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "approve",
    args: [TO_ADDRESS, approveAmount]
  });

  console.log(`Approve Tx Hash: ${txHash2}`);

  const allowance = await publicClient.readContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "allowance",
    args: [FROM_ADDRESS, TO_ADDRESS]
  });

  console.log(`Allowance: ${allowance} CAMP`);
}

main().catch((err) => {
  console.error("❌ Error in transferApprove:", err);
  process.exit(1);
});
