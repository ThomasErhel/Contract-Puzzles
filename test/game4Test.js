const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);

    return { game, signer1, signer2 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}

    const addr1 = await signer1.getAddress();
    const addr2 = await signer2.getAddress();

    // Write to the nested mapping using signer2
    await game.connect(signer2).write(addr1);

    // Call win() function using signer1
    await game.connect(signer1).win(addr2);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
