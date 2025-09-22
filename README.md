# ERC20 DIDLab Project

## Overview
This project demonstrates the deployment and interaction with an ERC20 token smart contract.  
It covers compiling contracts, deploying them, executing transfers and approvals, comparing gas usage for single vs batch transfers, and querying logs/events.  
Integration with **MetaMask** is also included for account management and token transfers.

---

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd erc20-didlab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables in a `.env` file:
   ```env
   RPC_URL=http://hh-12.didlabs.org
   CHAIN_ID=31348
   PRIVATE_KEY=your_private_key_here
   TOKEN_ADDRESS=your_token_contract_address_here
   ```

---

## Running Scripts

### 1. Compile the contracts
```bash
npx hardhat compile
```
✅ Confirms Solidity contract compilation.  
(Screenshot: `compile_success.png`)

---

### 2. List accounts
```bash
npx hardhat accounts
```
✅ Displays the faucet accounts with preloaded ETH.  
(Screenshot: `hardhat_accounts.png`)

---

### 3. Deploy the contract
```bash
node scripts/deploy.mjs
```
✅ Deploys the ERC20 contract and outputs the deployed address.  
(Screenshot: `deploy_contract.png`)

---

### 4. Transfer & Approve Tokens
```bash
node scripts/transferApprove.mjs
```
✅ Executes a transfer and an approval transaction.  
(Screenshot: `transfer_approve.png`)

---

### 5. Batch vs Single Transfers
```bash
node scripts/batchVsSingle.mjs
```
✅ Compares gas used for multiple single transfers vs a batch transfer.  
(Screenshot: `batch_vs_single.png`)

---

### 6. Logs & Events
```bash
node scripts/logsEvents.mjs
```
✅ Queries recent `Transfer` and `Approval` events.  
(Screenshot: `logs_events.png`)

---

### 7. Gas Analysis (Transactions)
```bash
node scripts/transactionsGas.mjs
```
✅ Shows transaction details, gas used, and block confirmations.  
(Screenshot: `transactions_gas.png`)

---

## MetaMask Configuration

1. Open **MetaMask** → **Networks** → **Add Network**.  
2. Enter the details:  
   - **Network Name**: DIDLab Team 12  
   - **RPC URL**: `http://hh-12.didlabs.org`  
   - **Chain ID**: `31348`  
   - **Currency Symbol**: `ETH`

(Screenshot: `metamask_add_network.png`)  
(Screenshot: `metamask_network_connected.png`)

3. Import your faucet account using **Private Key**.  
4. Import your token using the deployed **TOKEN_ADDRESS**.

---

## Project Parameters

- **RPC URL**: `http://hh-12.didlabs.org`  
- **Chain ID**: `31348`  
- **Token Address**: `0x850ec3780cedfdb116e38b009dbf7a1ef1b8b38`  

---

## Deliverables; these are the files i have delivered

- Scripts for:
  - Deployment
  - Transfers and approvals
  - Batch vs single transfer comparison
  - Logs & events query
- Screenshots:
  - `compile_success.png`
  - `compile_confirm.png`
  - `hardhat_accounts.png`
  - `deploy_contract.png`
  - `transfer_approve.png`
  - `batch_vs_single.png`
  - `logs_events.png`
  - `transactions_gas.png`
  - `metamask_add_network.png`
  - `metamask_network_connected.png`

---

