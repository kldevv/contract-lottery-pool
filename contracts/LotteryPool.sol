// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LotteryPool {
    uint256 private balance = 0;
    uint256 private minPayin = 0.001 ether;
    address private admin;
    address payable[] private tickets = new address payable[](0);

    constructor() {
        admin = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == admin);
        _;
    }

    function draw() public restricted {
        uint256 winner = getRandomInt() / tickets.length;
        tickets[winner].transfer(balance);
        balance = 0;
        tickets = new address payable[](0);
    }

    function enter() public payable {
        require(msg.value > minPayin);
        tickets.push(payable(msg.sender));
        balance += msg.value;
    }

    function getTickets()
        public
        view
        restricted
        returns (address payable[] memory)
    {
        return tickets;
    }

    function setMinPayin(uint256 newMinPayin) public restricted {
        minPayin = newMinPayin;
    }

    function getRandomInt() private view returns (uint256 nonce) {
        nonce = uint256(
            keccak256(
                abi.encode(block.timestamp, block.difficulty, block.number)
            )
        );
    }
}
