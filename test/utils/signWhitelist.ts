import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { signTypedData, SignTypedDataVersion, TypedMessage } from "@metamask/eth-sig-util";
import { ethers } from "hardhat";
import { EIP712NestedStructure } from "../../typechain-types";
import { HDNodeWallet } from "ethers";

export async function signWhitelist(
  wallet: HDNodeWallet,
  mail: EIP712NestedStructure.MailWithSubjectStruct,
  chainId: number,
  verifyingContract: string
): Promise<string> {
  const data: TypedMessage<any> = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
      ],
      Content: [
        { name: "subject", type: "string" },
        { name: "message", type: "string" }
      ],
      MailWithSubject: [
        { name: "to", type: "address" },
        { name: "content", type: "Content" }
      ]
    },
    domain: {
      name: "test",
      version: "1.0",
      chainId,
      verifyingContract
    },
    primaryType: "MailWithSubject",
    message: mail
  };

  const signature = signTypedData({
    privateKey: Buffer.from(wallet.privateKey.substring(2), "hex"),
    data,
    version: SignTypedDataVersion.V4
  });

  return signature;
}
