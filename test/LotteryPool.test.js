const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const { abi, bytecode } = require('../compile');

// Provider will change depending on the network.
const web3 = new Web3(ganache.provider());
// Test
let accounts;
let lotteryPool;

beforeEach(async () => {
    // Get a list of available accounts
    accounts = await web3.eth.getAccounts();
    // Use one of the accounts to deploy the contract
    lotteryPool = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Contract Deployment', () => {
    it('Contract deployed.', () => {
        assert.ok(lotteryPool);
    });

    it('Admin set.', async () => {
        const owner = await lotteryPool.methods.admin().call();
        assert.equal(owner, accounts[0]);
    });
});

describe('Contract Interaction' ,() => {
    it('One legal entrance set.', async () => {
        await lotteryPool.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const tickets = await lotteryPool.methods.getTickets().call({
            from: accounts[0]
        });
        assert.equal(tickets[0], accounts[0]);
        assert.equal(tickets.length, 1);
    });

    it('One illegal entrance rejected.', async () => {
        try {
            await lotteryPool.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.0001', 'ether')
            });
            assert.ok(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('Multiple legal entracne set.', async() => {
        await lotteryPool.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        await lotteryPool.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('3', 'ether')
        });
        await lotteryPool.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const tickets = await lotteryPool.methods.getTickets().call({
            from: accounts[0]
        });

        assert.equal(tickets.length, 3);
        assert.equal(tickets[0], accounts[0]);
        assert.equal(tickets[1], accounts[1]);
        assert.equal(tickets[2], accounts[0]);
    });

    // it('Admin privilege set.', ()
});
