import { ethers } from "ethers";

export interface NFT {
  price: ethers.BigNumber | string;
  tokenId: ethers.BigNumber | string;
  owner: string;
  seller: string;
  image?: string;
  name?: string;
  description?: string;
  sold?: boolean;
}
