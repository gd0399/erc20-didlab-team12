import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

// Load compiled contract JSON manually
const contractJson = JSON.parse(
  fs.readFileSync("./artifacts/contracts/CampusCredit.sol/CampusCredit.json", "utf8")
);

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = Number(process.env.CHAIN_ID);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_NAME = process.env.TOKEN_NAME;
const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;
const TOKEN_CAP = process.env.TOKEN_CAP;
const TOKEN_INITIAL = process.env.TOKEN_INITIAL;

async function main() {
  if (!PRIVATE_KEY || PRIVATE_KEY.length < 10) {
    throw new Error("❌ PRIVATE_KEY not set in .env");
  }

  const account = privateKeyToAccount(PRIVATE_KEY);

  // Wallet client
  const walletClient = createWalletClient({
    account,
    chain: {
      id: CHAIN_ID,
      name: "didlab",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [RPC_URL] } },
    },
    transport: http(RPC_URL),
  });

  // Public client
  const publicClient = createPublicClient({
    chain: {
      id: CHAIN_ID,
      name: "didlab",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [RPC_URL] } },
    },
    transport: http(RPC_URL),
  });

  // Convert supply values into 18-decimal units
  const cap = parseUnits(TOKEN_CAP, 18);
  const initialMint = parseUnits(TOKEN_INITIAL, 18);

  console.log("🚀 Deploying CampusCredit...");

  // Deploy contract
  const hash = await walletClient.deployContract({
    abi: contractJson.abi,
    bytecode: contractJson.bytecode,
    args: [TOKEN_NAME, TOKEN_SYMBOL, cap, account.address, initialMint],
  });

  console.log("Deploy tx hash:", hash);

  // Wait for receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("✅ Deployed contract address:", receipt.contractAddress);
  console.log("📦 Block number:", receipt.blockNumber);

  console.log("\n👉 Copy this address into your .env as TOKEN_ADDRESS");
}

main().catch((err) => {
  console.error("❌ Error deploying:", err);
  process.exit(1);
});
