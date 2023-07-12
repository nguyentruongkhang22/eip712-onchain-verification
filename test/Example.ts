import { expect } from "chai";
import { ethers } from "hardhat";

import { EIP712NestedStructure, EIP712NestedStructure__factory } from "../typechain-types";
import { signWhitelist } from "./utils/signWhitelist";

describe("EIP712NestedStructure", function () {
  it("verify", async function () {
    const [account] = await ethers.getSigners();
    const factory: EIP712NestedStructure__factory = await ethers.getContractFactory("EIP712NestedStructure");
    const eip712 = await factory.deploy();
    const chainId = Number(await eip712.getChainId());

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
    expect(recoveredSigner.toLowerCase()).to.eq(wallet.address.toLowerCase());
  });
});
