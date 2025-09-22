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

async function main() {
  const recipients = process.env.RECIPIENTS.split(",").map(a => a.trim().toLowerCase());
  const amounts = process.env.AMOUNTS.split(",").map(v => parseUnits(v.trim(), 18));

  console.log("=== Gas Comparison: Single vs Batch Airdrop ===");

  // --- Single transfers in loop ---
  let totalGasSingle = 0n;
  for (let i = 0; i < recipients.length; i++) {
    const hash = await walletClient.writeContract({
      address: TOKEN_ADDRESS,
      abi: contractJson.abi,
      functionName: "transfer",
      args: [recipients[i], amounts[i]]
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    totalGasSingle += receipt.gasUsed;
  }
  console.log(`Total Gas (Single Transfers): ${totalGasSingle}`);

  // --- Batch Airdrop ---
  const hashBatch = await walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: contractJson.abi,
    functionName: "airdrop",
    args: [recipients, amounts]
  });

  const receiptBatch = await publicClient.waitForTransactionReceipt({ hash: hashBatch });
  const gasBatch = receiptBatch.gasUsed;

  console.log(`Gas (Batch Airdrop): ${gasBatch}`);

  // --- Comparison ---
  const saved = (Number(totalGasSingle - gasBatch) / Number(totalGasSingle)) * 100;
  console.log(`✅ Gas Saved: ${saved.toFixed(2)}%`);
}

main().catch(err => {
  console.error("❌ Error in batchVsSingle:", err);
  process.exit(1);
});
