import { createPublicClient, http } from "viem";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Load contract ABI
const contractJson = JSON.parse(
  fs.readFileSync("./artifacts/contracts/CampusCredit.sol/CampusCredit.json", "utf8")
);

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = Number(process.env.CHAIN_ID);
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

const publicClient = createPublicClient({
  chain: {
    id: CHAIN_ID,
    name: "CustomChain",
    rpcUrls: { default: { http: [RPC_URL] } },
  },
  transport: http(RPC_URL),
});

async function main() {
  const currentBlock = await publicClient.getBlockNumber();

  // Look back 2000 blocks, but not below 0
  const fromBlock = currentBlock > 2000n ? currentBlock - 2000n : 0n;

  console.log(`🔍 Querying events from block ${fromBlock} to ${currentBlock}...`);

  // Transfer events
  const transferLogs = await publicClient.getLogs({
    address: TOKEN_ADDRESS,
    event: {
      type: "event",
      name: "Transfer",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
    fromBlock,
    toBlock: currentBlock,
  });

  console.log("=== Transfer Events ===");
  transferLogs.forEach((log) => {
    console.log(
      `Block ${log.blockNumber} | From: ${log.args.from} -> To: ${log.args.to} | Value: ${log.args.value}`
    );
  });

  // Approval events
  const approvalLogs = await publicClient.getLogs({
    address: TOKEN_ADDRESS,
    event: {
      type: "event",
      name: "Approval",
      inputs: [
        { name: "owner", type: "address", indexed: true },
        { name: "spender", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
    fromBlock,
    toBlock: currentBlock,
  });

  console.log("=== Approval Events ===");
  approvalLogs.forEach((log) => {
    console.log(
      `Block ${log.blockNumber} | Owner: ${log.args.owner} -> Spender: ${log.args.spender} | Value: ${log.args.value}`
    );
  });
}

main().catch((err) => {
  console.error("❌ Error querying logs:", err);
});
