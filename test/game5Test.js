const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { utils } = require('ethers');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }

  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck

    // Find a private key that generates an address lower than the threshold
    let privateKey;
    let wallet;
    let threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';

    let i = 1;
    while (true) {
      privateKey = '0x' + i.toString(16).padStart(64, '0');
      wallet = new ethers.Wallet(privateKey, ethers.provider);
      if (ethers.utils.hexlify(wallet.address) < threshold) {
        break;
      }
      i++;
    }

    // Get a default Hardhat account to transfer Ether
    const defaultAccount = ethers.provider.getSigner(0);

    // Transfer Ether to the new wallet
    await defaultAccount.sendTransaction({
      to: wallet.address,
      value: utils.parseEther('1')
    });

    // Call win() function using the new wallet
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
