const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    return { game, signer1, signer2, signer3 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(signer1).buy({ value: '2' }); // Update the value to 2
    await game.connect(signer2).buy({ value: '3' }); // Update the value to 3
    await game.connect(signer3).buy({ value: '1' }); // Update the value to 1

    const addr1 = await signer1.getAddress();
    const addr2 = await signer2.getAddress();
    const addr3 = await signer3.getAddress();

    // Pass the addresses in the correct order to win
    await game.win(addr1, addr2, addr3);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
