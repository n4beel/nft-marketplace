import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTMarketplace__factory } from "../typechain";

describe("NFTMarketplace", function () {
  it("Should create and execute market sales", async function () {
    const [owner, buyerAddress] = await ethers.getSigners();
    const market = await new NFTMarketplace__factory(owner).deploy();
    await market.deployed();

    const listingPrice = await market
      .getListingPrice()
      .then((price) => price.toString());
    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    // console.log("listing price", listingPrice) // 25000000000000000
    // console.log("auction price", auctionPrice) // { value: "1000000000000000000" }

    await market.createToken("https://www.mytokenlocation1.com", auctionPrice, {
      value: listingPrice,
    });
    await market.createToken("https://www.mytokenlocation2.com", auctionPrice, {
      value: listingPrice,
    });
    await market.createToken("https://www.mytokenlocation3.com", auctionPrice, {
      value: listingPrice,
    });
    await market.createToken("https://www.mytokenlocation4.com", auctionPrice, {
      value: listingPrice,
    });

    await market
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    const items = await market.fetchMarketItems();

    const marketItems = await Promise.all(
      items.map(async (i) => ({
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri: await market.tokenURI(i.tokenId),
      }))
    );

    // console.log("market items => ", marketItems)

    const myNFTs = await market.connect(buyerAddress).fetchMyNFTs();
    console.log("my NFTs => ", myNFTs);

    // const listedNFTs = await market.connect(buyerAddress).fetchItemsListed();
    // console.log("listed NFTs => ", listedNFTs);
  });
});
