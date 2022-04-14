const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { abi, bytecode } = require('./compile');

const { mnemonicPhras, ropstenNetwork } = require('./config.js');

const provider = new HDWalletProvider({
    mnemonic: mnemonicPhras,
    providerOrUrl: ropstenNetwork
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log(`Attempting to deploy contract with the account: \n${accounts[0]}`);

    const result = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

    console.log(`Contract deployed to: \n${result.options.address}`);
    provider.engine.stop();
};

deploy();
