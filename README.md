# YEI FINANCE - Decentralized Money Market Protocol on SEI

A comprehensive decentralized non-custodial money market protocol built on SEI blockchain, featuring asset deposits, lending, borrowing, flash loans, and risk management. YEI FINANCE offers flexible and innovative financial solutions on the high-performance SEI network.

## 🌐 SEI Blockchain Integration

YEI FINANCE is specifically designed for SEI blockchain, leveraging its high-performance consensus mechanism and parallel execution capabilities for optimal DeFi operations.

### Supported Features

- **Asset Deposits**: Improve market liquidity by depositing assets and earn passive income ✅ **ACTIVE**
- **Over-collateralized Loans**: Access funds through secure collateralized borrowing ✅ **ACTIVE**
- **Flash Loans**: Uncollateralized borrowing for arbitrage and advanced strategies ✅ **ACTIVE**
- **Risk Management**: Advanced tools and insights for financial risk mitigation ✅ **ACTIVE**
- **YEI Token Rewards**: Earn YEI tokens for participating in the protocol ✅ **ACTIVE**

### SEI Network Components

- **High Performance**: Leverage SEI's parallel execution for efficient DeFi operations
- **Low Latency**: Benefits from SEI's optimized consensus mechanism
- **Twin Turbo**: Utilize SEI's optimistic processing for faster transactions
- **Native DEX Integration**: Built-in order matching engine support

## 📍 Deployed Contracts on SEI Testnet

YEI FINANCE Protocol is live on SEI Testnet (Chain ID: 1328). Use these verified contract addresses:

### 🏛️ Core Protocol Contracts

| Contract                    | Address                                                                                                                 | Description                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **YEI Base Token (YBASE)**  | [`0xAA9A96863075B4E83D52CB7feADE77f097d0eFEC`](https://testnet.seitrace.com/address/0xAA9A96863075B4E83D52CB7feADE77f097d0eFEC) | Underlying asset token for deposits and lending    |
| **YEI Finance Token (YEI)** | [`0xB25bF8ed41eb8eB325859b2Afb66143076Ea5E9B`](https://testnet.seitrace.com/address/0xB25bF8ed41eb8eB325859b2Afb66143076Ea5E9B) | Protocol reward token for liquidity providers      |
| **YEI FINANCE Protocol**    | [`0xE2deB1946345F085a94F66d7014E7Fc1d76c6F12`](https://testnet.seitrace.com/address/0xE2deB1946345F085a94F66d7014E7Fc1d76c6F12) | Main protocol for deposits, loans, and flash loans |
| **YEI FINANCE Vault**       | [`0x16474D31Ac1302994cF3C5001DE24EdB699a306f`](https://testnet.seitrace.com/address/0x16474D31Ac1302994cF3C5001DE24EdB699a306f) | ERC4626 vault with 10% APY and 0.5% withdrawal fee |

### 🔧 Protocol Configuration

- **Network**: SEI Testnet (Atlantic-2)
- **Chain ID**: 1328
- **RPC URL**: `https://sei-testnet.g.alchemy.com/v2/`
- **Explorer**: [seitrace.com](https://seitrace.com/)
- **Testnet Faucet**: [faucet.sei.io](https://faucet.sei.io/)

### 💰 Token Information

- **YBASE Token**: 1,000,000 supply minted for testing
- **YEI Token**: 1,000,000 total supply (900K for users, 100K for protocol rewards)
- **Collateral Factor**: 80% LTV for borrowing
- **Annual Yield Rate**: 10% for vault deposits
- **Withdrawal Fee**: 0.5% (50 basis points)

### 🚀 Quick Start Integration

```javascript
// Contract addresses for your dApp integration
const YEI_CONTRACTS = {
  YBASE_TOKEN: "0xAA9A96863075B4E83D52CB7feADE77f097d0eFEC",
  YEI_TOKEN: "0xB25bF8ed41eb8eB325859b2Afb66143076Ea5E9B",
  YEI_PROTOCOL: "0xE2deB1946345F085a94F66d7014E7Fc1d76c6F12",
  YEI_VAULT: "0x16474D31Ac1302994cF3C5001DE24EdB699a306f",
};

// SEI Network configuration
const SEI_TESTNET = {
  chainId: 1328,
  rpcUrl: "https://sei-testnet.g.alchemy.com/v2",
  explorer: "https://seitrace.com/",
};
```

## 🏗️ Architecture Overview

YEI FINANCE implements a modular vault architecture optimized for SEI blockchain's capabilities:

### Core Modules

#### 📚 Libraries

- **`YieldMath.sol`** - Mathematical library for yield and interest calculations
  - Compound interest computation with Taylor series approximation
  - Linear yield calculations for short-term positions
  - Validation functions for rates and fees
  - Gas-optimized calculations for SEI network

#### 🏛️ Base Contracts

- **`VaultAccessControl.sol`** - Role-based access control system

  - Manager, Agent, and Pauser roles
  - Role validation and management
  - Access control modifiers

- **`VaultCore.sol`** - Core vault functionality

  - Strategy management (add/remove/execute)
  - Protocol integration lifecycle
  - Abstract contract for inheritance

- **`VaultFees.sol`** - Fee management system
  - Transaction fee calculation and collection
  - Treasury management for YEI ecosystem
  - Fee validation and limits

#### 🏦 Main Contracts

- **`Vault.sol`** - Complete vault implementation

  - ERC4626 compliance for asset management
  - Yield accrual and compounding
  - Strategy integration for SEI DeFi protocols
  - Fee management and distribution
  - Emergency pause functionality

- **`VaultFactory.sol`** - Factory for standardized vault creation

  - Automated vault deployment on SEI
  - Fee collection for vault creation
  - Default parameter management

- **`YeiFinanceProtocol.sol`** - Core YEI FINANCE protocol
  - Asset deposit and withdrawal functionality
  - Over-collateralized lending system
  - Flash loan capabilities
  - YEI token reward distribution
  - Risk management and collateral monitoring

## 🚀 Key Features

### 🔐 Access Control

- **Manager Role**: Strategy management, yield rate configuration, fee collection
- **Agent Role**: Strategy execution, reward harvesting, emergency operations
- **Pauser Role**: Emergency pause/unpause functionality
- **Owner**: Full administrative control and governance

### 💰 YEI FINANCE Money Market

- **Deposit Assets**: Earn passive income by providing liquidity to markets
- **Borrow Assets**: Access funds through over-collateralized loans (80% LTV)
- **Flash Loans**: Execute uncollateralized borrowing for arbitrage strategies
- **YEI Rewards**: Earn protocol tokens for participation and liquidity provision
- **Risk Management**: Real-time monitoring of collateral ratios and liquidation risks

### 🎯 SEI Network Optimization

- **Parallel Execution**: Optimized for SEI's twin turbo architecture
- **Low Latency Operations**: Benefits from SEI's 400ms finality
- **Native Integration**: Built-in support for SEI ecosystem protocols
- **Gas Efficiency**: Optimized for SEI's cost-effective transactions

### 💸 Fee System

- **Protocol Fees**: Competitive rates for borrowing and lending
- **YEI Treasury**: Fee collection for protocol development and rewards
- **Dynamic Rates**: Interest rates adjust based on utilization
- **Reward Distribution**: Fees partially distributed as YEI token rewards

## 📁 Project Structure

```
contracts/
├── base/                    # Base modular contracts (inherited by Vault.sol)
│   ├── VaultAccessControl.sol (91 lines)
│   ├── VaultCore.sol (196 lines)
│   └── VaultFees.sol (150 lines)
├── libraries/               # Reusable libraries
│   └── YieldMath.sol (168 lines)
├── interfaces/              # Contract interfaces
│   ├── Strategies.sol (157 lines)
│   ├── IVaultFactory.sol (193 lines)
│   └── Vault.sol (142 lines)
├── strategies/              # YEI FINANCE strategy implementations
│   ├── CoreStrategy.sol (292 lines) # Generic strategy base
│   └── strategies.sol (351 lines)   # Strategy management
├── mocks/                   # Mock contracts for testing
│   ├── MockERC20.sol (25 lines)     # Mock tokens
│   ├── MockStakeHub.sol (153 lines) # Mock staking
│   ├── MockCoreAgent.sol (248 lines) # Mock agent
│   ├── YeiFinanceProtocol.sol (160+ lines) # YEI FINANCE protocol
│   ├── MockSushiSwap.sol (269 lines)
│   ├── MockToken.sol (40 lines)
│   ├── MockUniswapV3.sol (339 lines)
│   └── MockUSDC.sol (44 lines)
├── Vault.sol (464 lines)    # Main vault contract
└── VaultFactory.sol (463 lines) # Factory contract
```

## 🧪 Testing

Comprehensive test coverage for YEI FINANCE protocol on SEI:

- **25+ passing tests** for YeiFinanceProtocol covering all functionality
- **184 passing tests** for complete vault system
- **Unit tests** for each module and SEI integration
- **Integration tests** for complete DeFi workflows
- **Mock SEI contracts** for realistic testing environment
- **Security testing** for collateral and liquidation scenarios

### Test Categories

- Constructor and role validation
- Asset deposit and withdrawal operations
- Over-collateralized borrowing and repayment
- Flash loan execution and validation
- YEI token reward distribution
- Collateral ratio monitoring
- Risk management and liquidation
- Fee collection and distribution
- Emergency pause scenarios

## 🔧 Usage

### Deploying YEI FINANCE Protocol

```solidity
// Deploy YEI FINANCE protocol
YeiFinanceProtocol yeiProtocol = new YeiFinanceProtocol(
    underlyingToken,    // Base asset (e.g., USDC, SEI)
    yeiToken           // YEI reward token
);

// Deploy vault for YEI integration
Vault vault = new Vault(
    underlyingToken,   // Asset token address
    "YEI Vault Token", // Token name
    "yUSDC",          // Token symbol
    manager,          // Manager address
    agent,            // Agent address
    100,              // 1% withdrawal fee
    500,              // 5% annual yield rate
    treasury          // YEI treasury address
);
```

### Using the YEI FINANCE Protocol (Live on SEI Testnet)

```javascript
// Connect to deployed YEI FINANCE Protocol
const YEI_PROTOCOL_ADDRESS = "0xE2deB1946345F085a94F66d7014E7Fc1d76c6F12";
const YBASE_TOKEN_ADDRESS = "0xAA9A96863075B4E83D52CB7feADE77f097d0eFEC";
const YEI_TOKEN_ADDRESS = "0xB25bF8ed41eb8eB325859b2Afb66143076Ea5E9B";

// Get contract instances
const yeiProtocol = new ethers.Contract(
  YEI_PROTOCOL_ADDRESS,
  YeiProtocolABI,
  signer
);
const ybaseToken = new ethers.Contract(YBASE_TOKEN_ADDRESS, ERC20ABI, signer);
const yeiToken = new ethers.Contract(YEI_TOKEN_ADDRESS, ERC20ABI, signer);

// 1. Deposit assets to earn passive income (10% APY)
const depositAmount = ethers.parseEther("100"); // 100 YBASE
await ybaseToken.approve(YEI_PROTOCOL_ADDRESS, depositAmount);
await yeiProtocol.deposit(depositAmount);

// 2. Borrow against collateral (80% LTV)
const borrowAmount = ethers.parseEther("50"); // 50 YBASE (50% of 100 deposit)
await yeiProtocol.borrow(borrowAmount);

// 3. Repay loans
const repayAmount = ethers.parseEther("25");
await ybaseToken.approve(YEI_PROTOCOL_ADDRESS, repayAmount);
await yeiProtocol.repay(repayAmount);

// 4. Claim YEI token rewards
await yeiProtocol.claimRewards();

// 5. Execute flash loan for arbitrage
const flashAmount = ethers.parseEther("1000");
await yeiProtocol.flashLoan(flashAmount);

// 6. Withdraw deposited assets
const withdrawAmount = ethers.parseEther("50");
await yeiProtocol.withdraw(withdrawAmount);
```

### YEI FINANCE Vault Integration

```javascript
// Connect to YEI FINANCE Vault (ERC4626)
const YEI_VAULT_ADDRESS = "0x16474D31Ac1302994cF3C5001DE24EdB699a306f";
const yeiVault = new ethers.Contract(YEI_VAULT_ADDRESS, VaultABI, signer);

// Deposit YBASE to earn 10% APY
const vaultDepositAmount = ethers.parseEther("1000");
await ybaseToken.approve(YEI_VAULT_ADDRESS, vaultDepositAmount);
await yeiVault.deposit(vaultDepositAmount, userAddress);

// Check shares and assets
const userShares = await yeiVault.balanceOf(userAddress);
const userAssets = await yeiVault.convertToAssets(userShares);

// Withdraw with 0.5% fee
const withdrawShares = ethers.parseEther("500"); // 500 yUSDC shares
await yeiVault.redeem(withdrawShares, userAddress, userAddress);
```

### SEI Network Integration

```javascript
// SEI Testnet Configuration
const SEI_TESTNET_CONFIG = {
  chainId: 1328,
  name: "SEI Testnet",
  rpcUrl: "https://sei-testnet.g.alchemy.com/v2/",
  explorer: "https://seitrace.com/",
  faucet: "https://faucet.sei.io/",
};

// Add SEI Testnet to MetaMask
await window.ethereum.request({
  method: "wallet_addEthereumChain",
  params: [
    {
      chainId: "0x530", // 1328 in hex
      chainName: "SEI Testnet",
      nativeCurrency: {
        name: "SEI",
        symbol: "SEI",
        decimals: 18,
      },
      rpcUrls: [SEI_TESTNET_CONFIG.rpcUrl],
      blockExplorerUrls: [SEI_TESTNET_CONFIG.explorer],
    },
  ],
});
```

## 🔒 Security Features

- **Reentrancy Protection**: All external calls secured against reentrancy
- **Collateral Monitoring**: Real-time collateral ratio validation
- **Liquidation Protection**: Automatic liquidation prevention mechanisms
- **Access Control**: Multi-role permission system
- **Emergency Pause**: Protocol-wide emergency stop functionality
- **Rate Limits**: Maximum borrowing and fee limits
- **Flash Loan Security**: Atomic transaction requirements
- **Input Validation**: Comprehensive parameter validation
- **Custom Errors**: Gas-efficient error handling with clear messages

## 📊 Gas Optimization for SEI

- **SEI Native Features**: Utilizes parallel execution and twin turbo
- **Efficient Calculations**: Optimized yield computation algorithms
- **Batch Operations**: Multi-asset operations in single transactions
- **Storage Optimization**: Minimal state variable footprint
- **Library Usage**: Reusable mathematical and utility functions
- **SEI Integration**: Native order matching and processing

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Hardhat
- Solidity 0.8.26+

### Setup

```bash
npm install
npx hardhat compile
npx hardhat test
```

### SEI Network Scripts

```bash
# Complete YEI FINANCE System Deployment
npm run deploy:yei-system:testnet   # Deploy on SEI testnet
npm run deploy:yei-system:mainnet   # Deploy on SEI mainnet (when available)

# Protocol Testing
npm run test:yei-finance            # Test YEI FINANCE protocol
npm run test:sei-integration        # Test SEI network integration

# Asset Management
npm run tokens:sei-testnet          # Get test tokens on SEI testnet
npm run interact:yei-testnet        # Interact with protocol

# Monitoring
npm run status:yei-testnet          # Check protocol status
npm run monitor:sei                 # Monitor SEI network status
```

## 📈 Performance on SEI

- **High Throughput**: Benefits from SEI's 20,000+ TPS capacity
- **Low Latency**: 400ms block finality for fast operations
- **Cost Effective**: Optimized gas usage for SEI network
- **Parallel Processing**: Multi-strategy execution optimization
- **Scalable Architecture**: Ready for SEI ecosystem growth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch focused on YEI FINANCE improvements
3. Add comprehensive tests for new functionality
4. Ensure SEI network compatibility
5. Submit a pull request with clear documentation

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

### YEI FINANCE Resources

- [YEI FINANCE Documentation](https://docs.yei.finance/)
- [YEI FINANCE Protocol Overview](https://yei.finance/)
- [YEI Community](https://discord.gg/yeifinance)

### SEI Network Resources

- [SEI Network Official](https://www.sei.io/)
- [SEI Documentation](https://docs.sei.io/)
- [SEI Developer Portal](https://docs.sei.io/dev/)
- [SEI Testnet Faucet](https://faucet.sei.io/)
- [SEI Block Explorer](https://seitrace.com/)

### Development Resources

- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [ERC4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [Hardhat Framework](https://hardhat.org/)

## 🏗️ Quick Start for YEI FINANCE on SEI

### Complete Development Flow

1. **Setup Environment**

```bash
# Clone and install
git clone <repository>
cd contracts-core
npm install

# Setup environment variables (create .env file)
# Add: PRIV_KEY, SEI_SCAN_KEY, etc.
```

2. **Development & Testing**

```bash
# Run YEI FINANCE tests
npm run test:yei-finance

# Deploy on SEI testnet
npx hardhat deploy --network sei_testnet

# Get test tokens
npm run tokens:sei-testnet
```

3. **Deploy YEI FINANCE System**

```bash
# Deploy complete protocol (recommended)
npm run deploy:yei-system:testnet

# Interact with protocol
npm run interact:yei-testnet
```

4. **Monitor & Manage**

```bash
# Check protocol status
npm run status:yei-testnet

# Monitor liquidity and utilization
npm run monitor:yei-protocol
```

## 📊 SEI Network Configuration

### Testnet (Atlantic-2)

- **Chain ID**: 1328
- **RPC**: https://sei-testnet.g.alchemy.com/v2/
- **Explorer**: https://seitrace.com/
- **Faucet**: https://faucet.sei.io/

### Features

- **Block Time**: ~400ms finality
- **Throughput**: 20,000+ TPS
- **Consensus**: Proof of Stake with optimistic processing
- **EVM Compatibility**: Full Ethereum compatibility with SEI optimizations

---

**YEI FINANCE** - Democratizing Access to DeFi on SEI Blockchain
