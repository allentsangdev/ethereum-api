// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Chat_Payment {
    // ------------------------------- Data Structures ------------------------------- //
    struct User {
        address userAddress;
        uint256 balance;
    }

    enum PaymentRequestState {
        Open,
        Rejected,
        Completed
    }

    struct PaymentRequest {
        uint256 paymentRequestId;
        address payable fundReceiver;
        uint256 txAmount;
        string room;
        string currency;
        PaymentRequestState paymentRequestState;
    }

    struct Escrow {
        uint256 escrowId;
        uint256 paymentRequestId;
        address fundReceiver;
        uint256 amount;
        bool isWithdrawn;
        uint256 releaseTime;
        string room;
    }

    // ------------------------------- State Variables ------------------------------- //

    User[] userList;
    PaymentRequest[] paymentRequestList;
    Escrow[] escrowList;

    uint256 constant FEE_PERCENT = 125; // 1.25%

    // ------------------------------- Functions ------------------------------- //

    function registerAsUser(address userAddress) public {
        userList.push(User({userAddress: userAddress, balance: 0}));
    }

    function getAllUser() public view returns (User[] memory) {
        return userList;
    }

    function topUpAccount() public payable {
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i].userAddress == msg.sender) {
                userList[i].balance += msg.value;
            }
        }
    }

    function initiatePaymentRequest(
        address _txReceiver,
        string memory room,
        string memory currency
    ) public payable {
        // require(msg.value == _txAmount * 1 ether, "Sent value must match the transaction amount");

        paymentRequestList.push(
            PaymentRequest({
                paymentRequestId: paymentRequestList.length,
                fundReceiver: payable(_txReceiver),
                txAmount: (msg.value),
                room: room,
                currency: currency,
                paymentRequestState: PaymentRequestState.Open
            })
        );
    }

    function acceptPaymentRequest(address _senderAddress, string memory _room) public payable {
        require(msg.value == 0, "Accepting a payment request does not require sending additional funds");

        for (uint256 i = 0; i < paymentRequestList.length; i++) {
            if (
                paymentRequestList[i].fundReceiver == _senderAddress &&
                keccak256(bytes(paymentRequestList[i].room)) == keccak256(bytes(_room)) &&
                paymentRequestList[i].paymentRequestState == PaymentRequestState.Open
            ) {
                uint256 feeAmount = (paymentRequestList[i].txAmount * FEE_PERCENT) / 10000;
                uint256 amountAfterFee = paymentRequestList[i].txAmount - feeAmount;

                escrowList.push(
                    Escrow({
                        escrowId: escrowList.length,
                        paymentRequestId: i,
                        fundReceiver: _senderAddress,
                        amount: amountAfterFee,
                        isWithdrawn: false,
                        releaseTime: block.timestamp,
                        room: _room
                    })
                );

                paymentRequestList[i].paymentRequestState = PaymentRequestState.Completed;
                return;
            }
        }
        revert("Matching payment request not found");
    }

    function initiateConditionalPayment(
        address _txReceiver,
        string memory room,
        string memory currency,
        uint256 _durationInSeconds
    ) public payable {
        // require(msg.value == _txAmount * 1 ether, "Sent value must match the transaction amount");

        paymentRequestList.push(
            PaymentRequest({
                paymentRequestId: paymentRequestList.length,
                fundReceiver: payable(_txReceiver),
                txAmount: (msg.value),
                room: room,
                currency: currency,
                paymentRequestState: PaymentRequestState.Open
            })
        );

        uint256 paymentRequestId = paymentRequestList.length - 1;
        uint256 releaseTime = block.timestamp + _durationInSeconds;

        escrowList.push(
            Escrow({
                escrowId: escrowList.length,
                paymentRequestId: paymentRequestId,
                fundReceiver: _txReceiver,
                amount: msg.value,
                isWithdrawn: false,
                releaseTime: releaseTime,
                room: room
            })
        );
    }

    function cancelConditionalPayment(string memory _room, address _senderAddress) public {
    for (uint256 i = 0; i < escrowList.length; i++) {
        Escrow storage escrow = escrowList[i];

        if (
            escrow.fundReceiver == _senderAddress &&
            keccak256(bytes(escrow.room)) == keccak256(bytes(_room)) &&
            escrow.isWithdrawn == false
        ) {
            escrow.isWithdrawn = true;
            paymentRequestList[escrow.paymentRequestId].paymentRequestState = PaymentRequestState.Rejected;
            return;
        }
    }
    revert("Matching conditional payment not found");
}


    function withdraw() public {
        for (uint256 i = 0; i < escrowList.length; i++) {
            if (
                escrowList[i].fundReceiver == msg.sender &&
                escrowList[i].isWithdrawn == false
            ) {
                escrowList[i].isWithdrawn = true;
                userList[getUserIndex(msg.sender)].balance += escrowList[i].amount;
                return;
            }
        }
        revert("No funds available for withdrawal");
    }

    function getUserIndex(address _userAddress) internal view returns (uint256) {
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i].userAddress == _userAddress) {
                return i;
            }
        }
        revert("User not found");
    }

    function acceptConditionalPayment(address _senderAddress, string memory _room) public payable {
        require(msg.value == 0, "Accepting a conditional payment does not require sending additional funds");

        for (uint256 i = 0; i < escrowList.length; i++) {
            Escrow storage escrow = escrowList[i];

            if (
                escrow.fundReceiver == msg.sender &&
                escrow.releaseTime <= block.timestamp &&
                keccak256(bytes(escrow.room)) == keccak256(bytes(_room)) &&
                escrow.isWithdrawn == false
            ) {
                uint256 paymentRequestId = escrow.paymentRequestId;

                require(
                    paymentRequestId < paymentRequestList.length,
                    "Invalid payment request ID"
                );
                require(
                    paymentRequestList[paymentRequestId].fundReceiver == _senderAddress,
                    "Sender address does not match the payment request"
                );
                require(
                    keccak256(bytes(paymentRequestList[paymentRequestId].room)) == keccak256(bytes(_room)),
                    "Room does not match the payment request"
                );
                require(
                    paymentRequestList[paymentRequestId].paymentRequestState == PaymentRequestState.Open,
                    "Payment request is not open"
                );

                uint256 feeAmount = (escrow.amount * FEE_PERCENT) / 10000;
                uint256 amountAfterFee = escrow.amount - feeAmount;

                escrow.isWithdrawn = true;
                userList[getUserIndex(msg.sender)].balance += amountAfterFee;

                paymentRequestList[paymentRequestId].paymentRequestState = PaymentRequestState.Completed;
                return;
            }
        }
        revert("Matching conditional payment not found");
    }

    function withdrawToExternalAddress(uint256 _amount, address payable _externalAddress) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(userList[getUserIndex(msg.sender)].balance >= _amount, "Insufficient balance");

        userList[getUserIndex(msg.sender)].balance -= _amount;
        _externalAddress.transfer(_amount);
    }
    
    function checkPaymentRequest(address _receiverAddress) public view returns (bool exists, uint256 balance) {
        uint256 totalBalance = 0;

        for (uint256 i = 0; i < paymentRequestList.length; i++) {
            if (
                paymentRequestList[i].fundReceiver == _receiverAddress &&
                paymentRequestList[i].paymentRequestState == PaymentRequestState.Open
            ) {
                totalBalance += paymentRequestList[i].txAmount;
            }
        }

        return (totalBalance > 0, totalBalance);
    }
}
