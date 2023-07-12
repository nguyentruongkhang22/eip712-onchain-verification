import { ethers } from "hardhat";
import { EIP712NestedStructure } from "../typechain-types";
import { signWhitelist } from "../test/utils/signWhitelist";

async function main() {
  const [account] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("EIP712NestedStructure");

  const eip712 = await factory.deploy({ gasLimit: 4700000 });
  await eip712.waitForDeployment();

  console.log("EIP712NestedStructure deployed to:", eip712.target);
  const contract = await ethers.getContractAt("EIP712NestedStructure", eip712.target);
  const chainId = Number(await contract.getChainId());
  const verifyingContract = await eip712.getAddress();

  const mail: EIP712NestedStructure.MailWithSubjectStruct = {
    to: account.address,
    content: {
      subject: "test subj",
      message: "mail message"
    }
  };
  const wallet = ethers.Wallet.createRandom();
  const signature = await signWhitelist(wallet, mail, chainId, verifyingContract);
  const recoveredSigner = await eip712.verify(signature, wallet.address, mail);

  const isValid = recoveredSigner === wallet.address;
  console.log(" -- isValid: ", isValid);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
