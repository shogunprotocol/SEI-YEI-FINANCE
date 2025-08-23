// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title YeiFinanceProtocol
 * @dev YEI FINANCE - A decentralized non-custodial money market protocol on SEI
 * @notice This protocol enables asset deposits, lending, and risk management on SEI blockchain
 */
contract YeiFinanceProtocol {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable underlyingToken;
    IERC20 public immutable yeiToken;
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public borrowedAmounts;

    // Protocol parameters
    uint256 public constant REWARD_RATE = 10; // 10% reward rate
    uint256 public constant COLLATERAL_FACTOR = 80; // 80% collateralization

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    // Errors
    error InsufficientBalance();
    error InsufficientCollateral();
    error ZeroAmount();

    constructor(address _underlyingToken, address _yeiToken) {
        underlyingToken = IERC20(_underlyingToken);
        yeiToken = IERC20(_yeiToken);
    }

    /**
     * @dev Deposits tokens into YEI FINANCE protocol to improve market liquidity
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;

        // Generate YEI rewards for liquidity providers
        rewards[msg.sender] += (amount * REWARD_RATE) / 100;

        emit Deposited(msg.sender, amount);
    }

    /**
     * @dev Withdraws tokens from YEI FINANCE protocol
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (deposits[msg.sender] < amount) revert InsufficientBalance();

        // Check if withdrawal doesn't affect collateral requirements
        uint256 remainingDeposits = deposits[msg.sender] - amount;
        uint256 requiredCollateral = (borrowedAmounts[msg.sender] * 100) /
            COLLATERAL_FACTOR;

        if (
            remainingDeposits < requiredCollateral &&
            borrowedAmounts[msg.sender] > 0
        ) {
            revert InsufficientCollateral();
        }

        deposits[msg.sender] -= amount;
        underlyingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Borrow assets through over-collateralized loans
     * @param amount Amount of tokens to borrow
     */
    function borrow(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        uint256 maxBorrow = (deposits[msg.sender] * COLLATERAL_FACTOR) / 100;
        uint256 totalBorrowed = borrowedAmounts[msg.sender] + amount;

        if (totalBorrowed > maxBorrow) revert InsufficientCollateral();

        borrowedAmounts[msg.sender] += amount;
        underlyingToken.safeTransfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    /**
     * @dev Repay borrowed assets
     * @param amount Amount of tokens to repay
     */
    function repay(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (borrowedAmounts[msg.sender] < amount) revert InsufficientBalance();

        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);
        borrowedAmounts[msg.sender] -= amount;

        emit Repaid(msg.sender, amount);
    }

    /**
     * @dev Claims YEI rewards from the protocol
     */
    function claimRewards() external {
        uint256 rewardAmount = rewards[msg.sender];
        if (rewardAmount == 0) revert ZeroAmount();

        rewards[msg.sender] = 0;
        yeiToken.safeTransfer(msg.sender, rewardAmount);

        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    /**
     * @dev Gets the deposit balance of a user
     * @param user Address of the user
     * @return uint256 Deposit balance of the user
     */
    function getBalance(address user) external view returns (uint256) {
        return deposits[user];
    }

    /**
     * @dev Gets the borrowed amount of a user
     * @param user Address of the user
     * @return uint256 Borrowed amount of the user
     */
    function getBorrowedAmount(address user) external view returns (uint256) {
        return borrowedAmounts[user];
    }

    /**
     * @dev Gets the YEI reward token address
     * @return address Address of the YEI reward token
     */
    function getRewardToken() external view returns (address) {
        return address(yeiToken);
    }

    /**
     * @dev Flash loan functionality for uncollateralized borrowing
     * @param amount Amount to flash loan
     */
    function flashLoan(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        uint256 balanceBefore = underlyingToken.balanceOf(address(this));
        underlyingToken.safeTransfer(msg.sender, amount);

        // Execute flash loan logic (caller must implement)
        // For demo purposes, we expect immediate repayment

        uint256 balanceAfter = underlyingToken.balanceOf(address(this));
        if (balanceAfter < balanceBefore) revert InsufficientBalance();
    }
}
