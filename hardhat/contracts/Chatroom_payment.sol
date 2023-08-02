// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Chat_Payment {

    // ------------------------------- Data Structure ------------------------------- //
    struct User {
        address userAddress;
        uint balance;
    }

    enum PaymentRequestState {Open, Rejected, Completed}
    enum PaymentRequestDecision {Accept, Reject}

    struct PaymentRequest {
        uint paymentRequestId;
        address payable fundReceiver;
        uint txAmount;
        PaymentRequestState paymentRequestState;
    }

    // ------------------------------- State variables ------------------------------- //
    
    // a list of User struct to keep track of registered users
    User[] userList;

    // a list of PaymentRequest struct to keep track of initialed paymnent requests
    PaymentRequest[] paymentRequestList;

    // ------------------------------- Functions ------------------------------- //
    function registerAsUser() public {
        userList.push(
            User({
                userAddress: msg.sender,
                balance: 0
        })
        );
    }

    function topUpAccount() payable public  {
        // find the user account first
        for (uint i = 0; i < userList.length; i++ ) {
            if(userList[i].userAddress == msg.sender) {
                userList[i].balance += msg.value;
            }
        }
    }

    function initiatePaymentRequest(uint _txAmount) public {
        paymentRequestList.push(
            PaymentRequest({
                paymentRequestId: paymentRequestList.length,
                fundReceiver: payable(msg.sender),
                txAmount: _txAmount,
                paymentRequestState: PaymentRequestState.Open
            })
        );
    }

    function getPaymentRequest(uint _paymentRequestId) public view returns(PaymentRequest memory targetPaymentRequest) {
        for (uint i = 0; i < paymentRequestList.length; i++ ) {
            if(paymentRequestList[i].paymentRequestId == _paymentRequestId) {
                return paymentRequestList[i];
            }
        }
    }

    function handlePaymentRequest(uint _paymentRequestId, PaymentRequestDecision _paymentRequestDecision) payable public {
        PaymentRequest memory targetPaymentRequest  = getPaymentRequest(_paymentRequestId);
        if (_paymentRequestDecision == PaymentRequestDecision.Accept) {
            // handle transaction
            targetPaymentRequest.fundReceiver.transfer(targetPaymentRequest.txAmount);
            // update state variable - PaymentRequestState to complete after successful txn
            // using for loop to locate target struct as we need to update the state variable
            // using getPaymentRequest can only update memory variable
            for (uint i = 0; i < paymentRequestList.length; i++ ) {
            if(paymentRequestList[i].paymentRequestId == _paymentRequestId) {
                paymentRequestList[i].paymentRequestState = PaymentRequestState.Completed;
            }
        }

        if (_paymentRequestDecision == PaymentRequestDecision.Reject) {
            // update paymentRequestState to rejected after rejecting txn
            for (uint i = 0; i < paymentRequestList.length; i++ ) {
            if(paymentRequestList[i].paymentRequestId == _paymentRequestId) {
                paymentRequestList[i].paymentRequestState = PaymentRequestState.Rejected;
            }
        }
    }

    // ------------------------------- Modifiers ------------------------------- //










}}}