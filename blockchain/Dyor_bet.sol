// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Dyor_bet {
    address owner;

    struct Bet {
        address creator;
        address challenger;
        uint amount;
        uint256 startAt;
        uint256 endAt;
        bool claimed;
        string symbol;
        string prediction;
        uint endPrice;
        uint256 startPrice;
    }

    // Total count of bets created.
    // It is also used to generate id for new bets.
    uint public count;
    
    // Mapping from id to Bet
    mapping(uint => Bet) public bets;

    //Get all
    // mapping (uint => mapping(bool => Bet[])) public Bets;

    function launch (
        uint32 _startAt,
        uint32 _endAt,
        string memory _symbol,
        string memory _prediction
    ) external payable {
        // require(msg.value == _amount);
        // require(_startAt >= block.timestamp, "start at < now");
        // require(_endAt >= _startAt, "end at < start at");
        // require(_endAt <= block.timestamp + 90 days, "end at > max duration");

        count += 1;
        bets[count] = Bet({
            creator: msg.sender,
            amount: msg.value,
            challenger: 0x0000000000000000000000000000000000000000,
            startAt: block.timestamp,
            endAt: block.timestamp + 10000,
            claimed: false,
            prediction: _prediction,
            symbol: _symbol,
            endPrice: 0,
            startPrice: 2500
        });

    }

    function cancel(uint _id) external payable {
        Bet storage bet = bets[_id];
        require(bet.creator == msg.sender, "not creator");
        require(block.timestamp < bet.startAt, "started");

        delete bets[_id];
    }

    function accept(uint _id) external payable {
        Bet storage bet = bets[_id];
        require(msg.value >= bet.amount);
        require(block.timestamp >= bet.startAt, "not started");
        require(block.timestamp <= bet.endAt, "ended");
        require(msg.sender != bet.creator, "ended");

        bet.challenger = msg.sender;
    }

    function compareStrings(string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function claim(uint _id) external payable {
        Bet storage bet = bets[_id];
        // require(block.timestamp > bet.endAt, "not ended");
        // require(bet.endPrice != 0, "End price not set");
        require(!bet.claimed, "claimed");
        
        if (msg.sender == bet.creator) {
            require((compareStrings(bet.prediction, "up") && bet.startPrice < bet.endPrice) || (compareStrings(bet.prediction, "down") && bet.startPrice > bet.endPrice), "You lost sorry bro!");
        } else {
            require((compareStrings(bet.prediction, "up") && bet.startPrice > bet.endPrice) || (compareStrings(bet.prediction, "down") && bet.startPrice < bet.endPrice), "You lost sorry bro!");
        }

        bet.claimed = true;

        uint _finalAmount = bet.amount * 2;
        _finalAmount = _finalAmount - (30 * _finalAmount / 100);
        transfer(msg.sender, _finalAmount);
    }

    function transfer(address _to, uint _amount) internal {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    function setEndPrice(uint _id, uint _endPrice ) public {
        Bet storage bet = bets[_id];
        // require(block.timestamp >= bet.startAt, "not started");
        // require(block.timestamp <= bet.endAt, "ended");
        require(msg.sender != owner, "Not owner");

        bet.endPrice = _endPrice;
    }
}