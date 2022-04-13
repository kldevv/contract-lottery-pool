const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'LotteryPool.sol');
const contractSource = fs.readFileSync(contractPath, 'utf-8');


const input = {
  language: 'Solidity',
  sources: {
    'LotteryPool.sol': {
      content: contractSource
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};


const output = JSON.parse(solc.compile(JSON.stringify(input)));

exports.abi = output.contracts['LotteryPool.sol']['LotteryPool'].abi;
exports.bytecode = output.contracts['LotteryPool.sol']['LotteryPool'].evm.bytecode.object;


