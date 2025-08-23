import { ethers, network } from "hardhat";

// SEI Network configuration
const SEI_NETWORK_CONFIG = {
  sei_testnet: {
    chainId: 1328,
    name: "SEI Testnet",
    currency: "SEI",
    explorer: "https://seitrace.com/",
    faucet: "https://faucet.sei.io/",
  },
};

// YEI FINANCE deployment configuration
const YEI_DEPLOYMENT_CONFIG = {
  vault: {
    name: "YEI Finance Vault",
    symbol: "yUSDC",
    withdrawalFee: 50, // 0.5% (50 basis points)
    yieldRate: 1000, // 10% annual yield (1000 basis points)
  },
  protocol: {
    underlyingTokenName: "YEI Base Token",
    underlyingTokenSymbol: "YBASE",
    yeiTokenName: "YEI Finance Token",
    yeiTokenSymbol: "YEI",
  },
};

async function main() {
  const currentNetwork = network.name;

  if (currentNetwork !== "sei_testnet") {
    console.log("❌ This script only supports SEI Network");
    console.log("Supported networks: sei_testnet");
    console.log(
      "Run: npx hardhat run scripts/deploy-vault-system.ts --network sei_testnet"
    );
    return;
  }

  const config = SEI_NETWORK_CONFIG.sei_testnet;
  const [deployer] = await ethers.getSigners();

  console.log(`🚀 Deploying YEI FINANCE Vault System on ${config.name}`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`🌐 Chain ID: ${config.chainId}`);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(
    `💰 Deployer balance: ${ethers.formatEther(balance)} ${config.currency}`
  );

  if (balance < ethers.parseEther("0.1")) {
    console.log(`❌ Insufficient ${config.currency} balance for deployment`);
    console.log(`💡 Need at least 0.1 ${config.currency} for gas fees`);
    console.log(`🚰 Get testnet tokens: ${config.faucet}`);
    return;
  }

  console.log("\n📋 YEI FINANCE Deployment Configuration:");
  console.log(`  Network: ${config.name}`);
  console.log(`  Explorer: ${config.explorer}`);
  console.log(`  Vault Name: ${YEI_DEPLOYMENT_CONFIG.vault.name}`);
  console.log(`  Vault Symbol: ${YEI_DEPLOYMENT_CONFIG.vault.symbol}`);
  console.log(
    `  Withdrawal Fee: ${YEI_DEPLOYMENT_CONFIG.vault.withdrawalFee / 100}%`
  );
  console.log(`  Yield Rate: ${YEI_DEPLOYMENT_CONFIG.vault.yieldRate / 100}%`);

  try {
    // Step 1: Deploy Mock Tokens for Testing
    console.log("\n🪙 Step 1: Deploying Mock Tokens...");

    // Deploy underlying token (YBASE)
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    const underlyingToken = await MockTokenFactory.deploy(
      YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenName,
      YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenSymbol
    );
    await underlyingToken.waitForDeployment();
    const underlyingTokenAddress = await underlyingToken.getAddress();
    console.log(
      `✅ Underlying Token (${YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenSymbol}) deployed: ${underlyingTokenAddress}`
    );

    // Deploy YEI token
    const yeiToken = await MockTokenFactory.deploy(
      YEI_DEPLOYMENT_CONFIG.protocol.yeiTokenName,
      YEI_DEPLOYMENT_CONFIG.protocol.yeiTokenSymbol
    );
    await yeiToken.waitForDeployment();
    const yeiTokenAddress = await yeiToken.getAddress();
    console.log(`✅ YEI Token deployed: ${yeiTokenAddress}`);

    // Mint initial supply
    const initialSupply = ethers.parseEther("1000000"); // 1M tokens
    await underlyingToken.mint(deployer.address, initialSupply);
    await yeiToken.mint(deployer.address, initialSupply);
    console.log(
      `✅ Minted ${ethers.formatEther(initialSupply)} tokens to deployer`
    );

    // Step 2: Deploy YEI FINANCE Protocol
    console.log("\n🏛️ Step 2: Deploying YEI FINANCE Protocol...");
    const YeiFinanceProtocolFactory = await ethers.getContractFactory(
      "YeiFinanceProtocol"
    );

    const yeiFinanceProtocol = await YeiFinanceProtocolFactory.deploy(
      underlyingTokenAddress,
      yeiTokenAddress
    );

    console.log("⏳ Waiting for YEI FINANCE Protocol deployment...");
    await yeiFinanceProtocol.waitForDeployment();
    const protocolAddress = await yeiFinanceProtocol.getAddress();
    console.log(`✅ YEI FINANCE Protocol deployed: ${protocolAddress}`);

    // Fund protocol with YEI tokens for rewards
    const protocolFunding = ethers.parseEther("100000"); // 100K YEI tokens
    await yeiToken.transfer(protocolAddress, protocolFunding);
    console.log(
      `✅ Funded protocol with ${ethers.formatEther(
        protocolFunding
      )} YEI tokens`
    );

    // Step 3: Deploy Vault
    console.log("\n🏦 Step 3: Deploying YEI FINANCE Vault...");
    const VaultFactory = await ethers.getContractFactory("Vault");

    const vault = await VaultFactory.deploy(
      underlyingTokenAddress, // underlying token (YBASE)
      YEI_DEPLOYMENT_CONFIG.vault.name, // name
      YEI_DEPLOYMENT_CONFIG.vault.symbol, // symbol
      deployer.address, // manager
      deployer.address, // agent (initially)
      YEI_DEPLOYMENT_CONFIG.vault.withdrawalFee, // withdrawal fee
      YEI_DEPLOYMENT_CONFIG.vault.yieldRate, // yield rate
      deployer.address // treasury
    );

    console.log("⏳ Waiting for Vault deployment...");
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log(`✅ YEI FINANCE Vault deployed: ${vaultAddress}`);

    // Step 4: Verify deployment
    console.log("\n🔍 Step 4: Verifying YEI FINANCE deployment...");

    // Verify YEI FINANCE Protocol
    console.log("📊 YEI FINANCE Protocol verification:");
    console.log(`  Protocol Address: ${protocolAddress}`);
    console.log(`  Underlying Token: ${underlyingTokenAddress}`);
    console.log(`  YEI Token: ${yeiTokenAddress}`);

    // Verify vault
    const vaultName = await vault.name();
    const vaultSymbol = await vault.symbol();
    const vaultAsset = await vault.asset();
    const vaultTotalAssets = await vault.totalAssets();
    const vaultTotalSupply = await vault.totalSupply();

    console.log("📊 YEI FINANCE Vault verification:");
    console.log(`  Name: ${vaultName}`);
    console.log(`  Symbol: ${vaultSymbol}`);
    console.log(`  Asset: ${vaultAsset}`);
    console.log(
      `  Total Assets: ${ethers.formatEther(vaultTotalAssets)} ${
        YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenSymbol
      }`
    );
    console.log(
      `  Total Supply: ${ethers.formatEther(vaultTotalSupply)} ${vaultSymbol}`
    );

    // Verify token balances
    const deployerUnderlyingBalance = await underlyingToken.balanceOf(
      deployer.address
    );
    const deployerYeiBalance = await yeiToken.balanceOf(deployer.address);
    const protocolYeiBalance = await yeiToken.balanceOf(protocolAddress);

    console.log("📊 Token Balance verification:");
    console.log(
      `  Deployer ${
        YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenSymbol
      }: ${ethers.formatEther(deployerUnderlyingBalance)}`
    );
    console.log(`  Deployer YEI: ${ethers.formatEther(deployerYeiBalance)}`);
    console.log(`  Protocol YEI: ${ethers.formatEther(protocolYeiBalance)}`);

    // Final summary
    console.log("\n🎉 YEI FINANCE Deployment Summary:");
    console.log("=".repeat(60));
    console.log(`Network: ${config.name} (Chain ID: ${config.chainId})`);
    console.log(`Explorer: ${config.explorer}`);
    console.log(
      `Underlying Token (${YEI_DEPLOYMENT_CONFIG.protocol.underlyingTokenSymbol}): ${underlyingTokenAddress}`
    );
    console.log(`YEI Token: ${yeiTokenAddress}`);
    console.log(`YEI FINANCE Protocol: ${protocolAddress}`);
    console.log(`YEI FINANCE Vault: ${vaultAddress}`);

    console.log("\n💾 Environment Variables:");
    console.log("Add these to your .env file:");
    console.log(`SEI_TESTNET_UNDERLYING_TOKEN=${underlyingTokenAddress}`);
    console.log(`SEI_TESTNET_YEI_TOKEN=${yeiTokenAddress}`);
    console.log(`SEI_TESTNET_YEI_PROTOCOL=${protocolAddress}`);
    console.log(`SEI_TESTNET_YEI_VAULT=${vaultAddress}`);

    console.log("\n🎯 Next Steps:");
    console.log(`1. Update .env with the addresses above`);
    console.log(`2. Visit ${config.explorer} to view deployed contracts`);
    console.log(`3. Test YEI FINANCE protocol:`);
    console.log(`   - Deposit assets to earn yield`);
    console.log(`   - Borrow against collateral (80% LTV)`);
    console.log(`   - Claim YEI token rewards`);
    console.log(`   - Use flash loans for arbitrage`);
    console.log(`4. Get more testnet tokens: ${config.faucet}`);
  } catch (error) {
    console.error("❌ YEI FINANCE Deployment failed:", error);

    if (error instanceof Error) {
      console.error("Error details:", error.message);

      if (error.message.includes("insufficient funds")) {
        console.log(
          `💡 Solution: Add more ${config.currency} tokens to your wallet`
        );
        console.log(`🚰 Get testnet tokens: ${config.faucet}`);
      } else if (error.message.includes("nonce")) {
        console.log("💡 Solution: Wait a moment and try again (nonce issue)");
      } else if (error.message.includes("gas")) {
        console.log("💡 Solution: Increase gas limit or gas price");
      } else if (error.message.includes("contract")) {
        console.log("💡 Solution: Check contract compilation and dependencies");
      }
    }

    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure you have SEI testnet tokens");
    console.log("2. Check network configuration in hardhat.config.ts");
    console.log("3. Verify contract compilation: npx hardhat compile");
    console.log("4. Try deploying with higher gas limit");

    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
