import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { YeiFinanceProtocol, MockToken } from "../typechain-types";

describe("YeiFinanceProtocol", function () {
  let protocol: YeiFinanceProtocol;
  let underlyingToken: MockToken;
  let yeiToken: MockToken;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  const INITIAL_BALANCE = ethers.parseEther("1000");
  const PROTOCOL_YEI_BALANCE = ethers.parseEther("100000");

  beforeEach(async function () {
    // Get signers
    [owner, alice, bob] = await ethers.getSigners();

    // Deploy tokens
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    underlyingToken = await MockTokenFactory.deploy(
      "Underlying Token",
      "UNDER"
    );
    yeiToken = await MockTokenFactory.deploy("YEI Finance Token", "YEI");

    // Deploy YEI FINANCE protocol
    const YeiFinanceProtocolFactory = await ethers.getContractFactory(
      "YeiFinanceProtocol"
    );
    protocol = await YeiFinanceProtocolFactory.deploy(
      await underlyingToken.getAddress(),
      await yeiToken.getAddress()
    );

    // Setup test accounts
    await underlyingToken.transfer(alice.address, INITIAL_BALANCE);
    await underlyingToken.transfer(bob.address, INITIAL_BALANCE);

    // Fund protocol with YEI tokens
    await yeiToken.transfer(await protocol.getAddress(), PROTOCOL_YEI_BALANCE);
  });

  describe("Constructor", function () {
    it("Should set the correct underlying token", async function () {
      expect(await protocol.underlyingToken()).to.equal(
        await underlyingToken.getAddress()
      );
    });

    it("Should set the correct YEI token", async function () {
      expect(await protocol.yeiToken()).to.equal(await yeiToken.getAddress());
    });
  });

  describe("Deposit - Improve Market Liquidity", function () {
    it("Should deposit tokens successfully", async function () {
      const depositAmount = ethers.parseEther("100");

      // Approve and deposit
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);

      // Check event emission
      await expect(protocol.connect(alice).deposit(depositAmount))
        .to.emit(protocol, "Deposited")
        .withArgs(alice.address, depositAmount);

      // Verify balances
      expect(await protocol.deposits(alice.address)).to.equal(depositAmount);
      expect(await protocol.rewards(alice.address)).to.equal(
        depositAmount / 10n
      ); // 10% YEI rewards
      expect(await underlyingToken.balanceOf(alice.address)).to.equal(
        INITIAL_BALANCE - depositAmount
      );
      expect(
        await underlyingToken.balanceOf(await protocol.getAddress())
      ).to.equal(depositAmount);
    });

    it("Should handle multiple deposits for liquidity provision", async function () {
      const firstDeposit = ethers.parseEther("100");
      const secondDeposit = ethers.parseEther("50");
      const totalDeposit = firstDeposit + secondDeposit;

      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), totalDeposit);

      await protocol.connect(alice).deposit(firstDeposit);
      await protocol.connect(alice).deposit(secondDeposit);

      expect(await protocol.deposits(alice.address)).to.equal(totalDeposit);
      expect(await protocol.rewards(alice.address)).to.equal(
        totalDeposit / 10n
      );
    });

    it("Should revert with zero amount", async function () {
      await expect(
        protocol.connect(alice).deposit(0)
      ).to.be.revertedWithCustomError(protocol, "ZeroAmount");
    });
  });

  describe("Borrow - Over-collateralized Loans", function () {
    const depositAmount = ethers.parseEther("100");

    beforeEach(async function () {
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);
    });

    it("Should allow borrowing with sufficient collateral", async function () {
      const borrowAmount = ethers.parseEther("50"); // 50% of collateral

      await expect(protocol.connect(alice).borrow(borrowAmount))
        .to.emit(protocol, "Borrowed")
        .withArgs(alice.address, borrowAmount);

      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        borrowAmount
      );
      expect(await underlyingToken.balanceOf(alice.address)).to.equal(
        INITIAL_BALANCE - depositAmount + borrowAmount
      );
    });

    it("Should revert with insufficient collateral", async function () {
      const borrowAmount = ethers.parseEther("90"); // 90% exceeds 80% collateral factor

      await expect(
        protocol.connect(alice).borrow(borrowAmount)
      ).to.be.revertedWithCustomError(protocol, "InsufficientCollateral");
    });

    it("Should allow maximum borrowing at 80% collateral factor", async function () {
      const maxBorrow = (depositAmount * 80n) / 100n; // 80% of deposit

      await protocol.connect(alice).borrow(maxBorrow);
      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        maxBorrow
      );
    });
  });

  describe("Repay Loans", function () {
    const depositAmount = ethers.parseEther("100");
    const borrowAmount = ethers.parseEther("50");

    beforeEach(async function () {
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);
      await protocol.connect(alice).borrow(borrowAmount);
    });

    it("Should repay borrowed amount successfully", async function () {
      const repayAmount = ethers.parseEther("30");

      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), repayAmount);

      await expect(protocol.connect(alice).repay(repayAmount))
        .to.emit(protocol, "Repaid")
        .withArgs(alice.address, repayAmount);

      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        borrowAmount - repayAmount
      );
    });

    it("Should allow full repayment", async function () {
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), borrowAmount);
      await protocol.connect(alice).repay(borrowAmount);

      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(0);
    });
  });

  describe("Withdraw - Risk Management", function () {
    const depositAmount = ethers.parseEther("100");

    beforeEach(async function () {
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);
    });

    it("Should withdraw tokens successfully when no loans", async function () {
      const withdrawAmount = ethers.parseEther("50");

      await expect(protocol.connect(alice).withdraw(withdrawAmount))
        .to.emit(protocol, "Withdrawn")
        .withArgs(alice.address, withdrawAmount);

      expect(await protocol.deposits(alice.address)).to.equal(
        depositAmount - withdrawAmount
      );
    });

    it("Should prevent withdrawal that affects collateral requirements", async function () {
      const borrowAmount = ethers.parseEther("60"); // Borrow 60%
      const withdrawAmount = ethers.parseEther("50"); // Would leave only 50% collateral

      await protocol.connect(alice).borrow(borrowAmount);

      await expect(
        protocol.connect(alice).withdraw(withdrawAmount)
      ).to.be.revertedWithCustomError(protocol, "InsufficientCollateral");
    });

    it("Should allow withdrawal that maintains collateral ratio", async function () {
      const borrowAmount = ethers.parseEther("40"); // Borrow 40%
      const withdrawAmount = ethers.parseEther("30"); // Leave 70% collateral

      await protocol.connect(alice).borrow(borrowAmount);
      await protocol.connect(alice).withdraw(withdrawAmount);

      expect(await protocol.deposits(alice.address)).to.equal(
        depositAmount - withdrawAmount
      );
    });
  });

  describe("Claim YEI Rewards", function () {
    it("Should claim YEI rewards successfully", async function () {
      const depositAmount = ethers.parseEther("100");
      const expectedRewards = depositAmount / 10n; // 10% YEI rewards

      // Deposit to generate rewards
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);

      // Claim YEI rewards
      await expect(protocol.connect(alice).claimRewards())
        .to.emit(protocol, "RewardsClaimed")
        .withArgs(alice.address, expectedRewards);

      // Verify balances
      expect(await protocol.rewards(alice.address)).to.equal(0);
      expect(await yeiToken.balanceOf(alice.address)).to.equal(expectedRewards);
    });

    it("Should revert with zero rewards", async function () {
      await expect(
        protocol.connect(alice).claimRewards()
      ).to.be.revertedWithCustomError(protocol, "ZeroAmount");
    });
  });

  describe("Flash Loans - Uncollateralized Borrowing", function () {
    it("Should execute flash loan successfully", async function () {
      const flashAmount = ethers.parseEther("100");

      // Fund protocol first
      await underlyingToken.transfer(await protocol.getAddress(), flashAmount);

      // For this test, we'll just check that the function can be called
      // In a real implementation, the caller would need to implement the flash loan logic
      await protocol.connect(alice).flashLoan(flashAmount);
    });

    it("Should revert flash loan with zero amount", async function () {
      await expect(
        protocol.connect(alice).flashLoan(0)
      ).to.be.revertedWithCustomError(protocol, "ZeroAmount");
    });
  });

  describe("View Functions", function () {
    it("Should return correct deposit balance", async function () {
      const depositAmount = ethers.parseEther("100");

      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);

      expect(await protocol.getBalance(alice.address)).to.equal(depositAmount);
      expect(await protocol.getBalance(bob.address)).to.equal(0);
    });

    it("Should return correct borrowed amount", async function () {
      const depositAmount = ethers.parseEther("100");
      const borrowAmount = ethers.parseEther("50");

      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), depositAmount);
      await protocol.connect(alice).deposit(depositAmount);
      await protocol.connect(alice).borrow(borrowAmount);

      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        borrowAmount
      );
      expect(await protocol.getBorrowedAmount(bob.address)).to.equal(0);
    });

    it("Should return YEI token address", async function () {
      expect(await protocol.getRewardToken()).to.equal(
        await yeiToken.getAddress()
      );
    });
  });

  describe("Integration Tests - YEI FINANCE on SEI", function () {
    it("Should handle multiple users in YEI ecosystem", async function () {
      const aliceDeposit = ethers.parseEther("100");
      const bobDeposit = ethers.parseEther("200");

      // Alice provides liquidity
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), aliceDeposit);
      await protocol.connect(alice).deposit(aliceDeposit);

      // Bob provides liquidity
      await underlyingToken
        .connect(bob)
        .approve(await protocol.getAddress(), bobDeposit);
      await protocol.connect(bob).deposit(bobDeposit);

      // Verify individual balances
      expect(await protocol.deposits(alice.address)).to.equal(aliceDeposit);
      expect(await protocol.deposits(bob.address)).to.equal(bobDeposit);
      expect(await protocol.rewards(alice.address)).to.equal(
        aliceDeposit / 10n
      );
      expect(await protocol.rewards(bob.address)).to.equal(bobDeposit / 10n);

      // Alice borrows against collateral
      const aliceBorrow = ethers.parseEther("60");
      await protocol.connect(alice).borrow(aliceBorrow);

      // Bob claims YEI rewards
      await protocol.connect(bob).claimRewards();

      // Final verification
      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        aliceBorrow
      );
      expect(await protocol.rewards(bob.address)).to.equal(0);
      expect(await yeiToken.balanceOf(bob.address)).to.equal(bobDeposit / 10n);
    });

    it("Should handle complex DeFi flow on SEI", async function () {
      const amount = ethers.parseEther("100");

      // Alice: deposit -> borrow -> repay -> claim rewards
      await underlyingToken
        .connect(alice)
        .approve(await protocol.getAddress(), amount * 2n);

      await protocol.connect(alice).deposit(amount);
      await protocol.connect(alice).borrow(amount / 2n);
      await protocol.connect(alice).repay(amount / 4n);
      await protocol.connect(alice).claimRewards();

      expect(await protocol.deposits(alice.address)).to.equal(amount);
      expect(await protocol.getBorrowedAmount(alice.address)).to.equal(
        amount / 4n
      );
      expect(await yeiToken.balanceOf(alice.address)).to.equal(amount / 10n);
    });
  });
});
