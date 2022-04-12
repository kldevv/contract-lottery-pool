const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const { abi, bytecode } = require('../compile');

// Provider will change depending on the network.
const web3 = new Web3(ganache.provider());
// Test
let accounts;
let mBox;
const INIT_MSG = 100;

beforeEach(async () => {
    // Get a list of available accounts
    accounts = await web3.eth.getAccounts();
    // Use one of the accounts to deploy the contract
    mBox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [100]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Message Box', () => {
    it('Deploy Contract', () => {
        assert.ok(mBox.options.address);
    });

    it('Initialize Message', async () => {
        const returnMsg = await mBox.methods.getMessage().call();
        assert.equal(returnMsg, INIT_MSG);
    });

    it('Set message', async () => {
        const setMsg = 200;
        await mBox.methods.setMessage(setMsg).send( {from: accounts[0]} );

        const returnMsg = await mBox.methods.getMessage().call();
        assert.equal(returnMsg, setMsg);
    });
});
