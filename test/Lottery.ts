import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery } from "../typechain-types/Lottery";

describe("Lottery", function () {
  let lottery: Lottery;
  let signers: any;
  let lotteryManager: any;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    lotteryManager = signers[0];

    const lotteryFactory = await ethers.getContractFactory("Lottery", lotteryManager);

    lottery = (await lotteryFactory.deploy()) as Lottery;
    await lottery.deployed();

    expect(lottery.address).to.properAddress;
  });
  describe("Enter the lottery ", async () => {
    it("should player enter the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await lottery.connect(signers[1]).enterLottery({ value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getBalance()).to.be.eq(ethers.utils.parseEther("0.1"));
      expect(await lottery.getTotalPlayers()).to.be.eq(1);
      expect(await lottery.getPlayer(0)).to.be.eq(signers[1].address);
    });
    it("should player enter the lottery (receive function)", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getBalance()).to.be.eq(ethers.utils.parseEther("0.1"));
      expect(await lottery.getTotalPlayers()).to.be.eq(1);
      expect(await lottery.getPlayer(0)).to.be.eq(signers[1].address);
    });
    it("should fail when player enter the lottery with insufficient funds", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await expect(lottery.connect(signers[1]).enterLottery({ value: 0 })).to.be.revertedWith("Not enough funds!");
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
    });
    it("should fail when lottery manager enter the lottery", async () => {
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      expect(await lottery.getLotteryManager()).to.be.eq(lotteryManager.address);
      await expect(lottery.enterLottery({ value: ethers.utils.parseEther("0.1") })).to.be.revertedWith("The manager can not participate in the lottery!");
    });
  });

  describe("Pick lottery winner", async () => {
    it("should lottery manager pick a winner if there are minimum 3 players in the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getLotteryManager()).to.be.eq(lotteryManager.address);
      await lottery.pickWinner();
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
    });
    it("should the lottery manager pick a winner if less than 10 players participate in the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[4].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getLotteryManager()).to.be.eq(lotteryManager.address);
      await lottery.pickWinner();
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
    });
    it("should the lottery manager pick a winner if more than 10 players participate in the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[4].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[5].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[6].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[7].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[8].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[9].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[10].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[11].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await lottery.pickWinner();
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
    });
    it("should any participant pick a winner if more than 10 players participate in the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[4].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[5].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[6].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[7].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[8].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[9].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[10].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getLotteryManager()).to.not.be.eq(signers[4].address);
      await lottery.connect(signers[4]).pickWinner();
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
    });
    it("should fail to pick a winner if there are less than 3 players in the lottery", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await expect(lottery.pickWinner()).to.be.revertedWith("Not enough players to finish lottery!");
    });
    it("should fail when player pick a winner if less than 10 players participate in the lottery", async () => {
      lottery = await lottery.connect(signers[7]);
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[4].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[5].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await expect(lottery.pickWinner()).to.be.revertedWith("You are not manager!");
    });
    it("should fail when non-participant pick a winner", async () => {
      expect(await lottery.getBalance()).to.be.eq(0);
      expect(await lottery.getTotalPlayers()).to.be.eq(0);
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[4].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[5].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[6].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[7].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[8].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[9].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[10].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      expect(await lottery.getLotteryManager()).to.not.be.eq(signers[4].address);
      await expect(lottery.connect(signers[11]).pickWinner()).to.be.revertedWith("You are not participate in the lottery!");
    });
  });
  describe("Lottery contract events", async () => {
    it("should enterLottery function emit lotteryEnter event", async () => {
      await expect(lottery.connect(signers[1]).enterLottery({ value: ethers.utils.parseEther("0.1") }))
        .to.emit(lottery, "lotteryEnter")
        .withArgs(signers[1].address, ethers.utils.parseEther("0.1"));
    });
    it("should pickWinner function emit lotteryWinner event", async () => {
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await expect(lottery.pickWinner())
        .to.emit(lottery, "lotteryWinner")
        .withArgs(await lottery.getLotteryWinner(0));
    });
    it("should pickwinner function emit lotteryWinnerPrize event", async () => {
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      const lotteryBalance = await lottery.getBalance();
      await expect(lottery.pickWinner()).to.emit(lottery, "lotteryWinnerPrize").withArgs(lotteryBalance.mul(90).div(100));
    });
    it("should pickWinner function emit lotteryManagerFee event", async () => {
      await signers[1].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[2].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      await signers[3].sendTransaction({ to: lottery.address, value: ethers.utils.parseEther("0.1") });
      const lotteryBalance = await lottery.getBalance();
      await expect(lottery.pickWinner()).to.emit(lottery, "lotteryManagerFee").withArgs(lotteryBalance.mul(10).div(100));
    });
  });
});
