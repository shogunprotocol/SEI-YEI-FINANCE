import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("YeiFinanceProtocolModule", (m) => {
  // Parameters for token addresses
  const underlyingTokenAddress = m.getParameter("underlyingTokenAddress");
  const yeiTokenAddress = m.getParameter("yeiTokenAddress");

  // Deploy YEI FINANCE Protocol
  const yeiFinanceProtocol = m.contract("YeiFinanceProtocol", [
    underlyingTokenAddress,
    yeiTokenAddress,
  ]);

  return { yeiFinanceProtocol };
});
