// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LotteryPool {
    uint256 public minPayin = 0.001 ether;
    address public admin;
    address payable[] private tickets = new address payable[](0);

    constructor() {
        admin = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == admin);
        _;
    }

    function draw() public restricted {
        require(tickets.length > 0);
        uint256 winner = getRandomInt() % tickets.length;
        tickets[winner].transfer(address(this).balance);
        tickets = new address payable[](0);
    }

    function enter() public payable {
        require(msg.value > minPayin);
        tickets.push(payable(msg.sender));
    }

    function getTickets() public view returns (address payable[] memory) {
        return tickets;
    }

    function getRandomInt() private view returns (uint256 nonce) {
        nonce = uint256(
            keccak256(
                abi.encode(block.timestamp, block.difficulty, block.number)
            )
        );
    }
}
