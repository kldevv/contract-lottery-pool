const path = require('path');
const fs = require('fs');
const solc = require('solc');

const msgBoxPath = path.resolve(__dirname, 'contracts', 'MessageBox.sol');
const msgBoxSource = fs.readFileSync(msgBoxPath, 'utf-8');


const input = {
  language: 'Solidity',
  sources: {
    'MessageBox.sol': {
      content: msgBoxSource
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

exports.abi = output.contracts['MessageBox.sol']['MessageBox'].abi;
exports.bytecode = output.contracts['MessageBox.sol']['MessageBox'].evm.bytecode.object;


