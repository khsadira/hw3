// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Dyor_bet {

    struct Bet {
        // Creator of bet
        address creator;
        // Challenger of bet
        address challenger;
        // Amount of beted
        uint amount;
        // Timestamp of start of bet
        uint32 startAt;
        // Timestamp of end of bet
        uint32 endAt;
        // True if amount was reached and creator has claimed the tokens.
        bool claimed;
        // Symbol of bet
        string symbol;
        // Prediction of bet
        uint prediction;
    }

    // Total count of bets created.
    // It is also used to generate id for new bets.
    uint public count;
    // Mapping from id to Bet
    mapping(uint => Bet) public bets;
    //Get all
    // mapping (uint => mapping(bool => Bet[])) public Bets;

    function launch (
        uint _amount,
        uint32 _startAt,
        uint32 _endAt,
        string memory _symbol,
        uint _prediction
    ) external payable {
        require(msg.value == _amount);
        require(_startAt >= block.timestamp, "start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 90 days, "end at > max duration");

        count += 1;
        bets[count] = Bet({
            creator: msg.sender,
            amount: _amount,
            challenger: 0x0000000000000000000000000000000000000000,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false,
            prediction: _prediction,
            symbol: _symbol
        });

    }

    function cancel(uint _id) external payable {
        Bet memory bet = bets[_id];
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

    function claim(uint _id) external payable {
        Bet storage bet = bets[_id];
        require(block.timestamp > bet.endAt, "not ended");
        require(!bet.claimed, "claimed");

        bet.claimed = true;
        transfer(msg.sender, bet.amount);
    }

    function transfer(address _to, uint _amount) internal {
        // Note that "to" is declared as payable
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}