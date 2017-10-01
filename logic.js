var calc1 = function (user, max) {
    var max = max;
    var db = require("./models"); 
    
    return db.Loan.findAll({   //return all loans for user 
        where: { UserUserId: user }
    }).then(function (data) {

        var length = data.length;

        var snowBallArray = []; //initialize snowballArray
        for (var i = 0; i < length; i++) {
            snowBallArray.push(data[i]);
        }

        var avalancheArray = []; //initialize avalanche array
        for (var i = 0; i < length; i++) {
            avalancheArray.push(data[i]);
        }

        for (var count = 0; count < length; count++) { //sort snowBall
            for (var i = 0; i < length - 1; i++) {
                if (parseFloat(snowBallArray[i].balance) > parseFloat(snowBallArray[i + 1].balance)) {
                    var placeholder = snowBallArray[i];
                    snowBallArray[i] = snowBallArray[i + 1];
                    snowBallArray[i + 1] = placeholder;
                }
            }
        }

        for (var count = 0; count < length; count++) { //sort avalanche
            for (var i = 0; i < length - 1; i++) {
                if (parseFloat(avalancheArray[i].interest_rate) < parseFloat(avalancheArray[i + 1].interest_rate)) {
                    var placeholder = avalancheArray[i];
                    avalancheArray[i] = avalancheArray[i + 1];
                    avalancheArray[i + 1] = placeholder;
                }
            }
        }
        var snowBallResult = test(snowBallArray, max); //testing methods
        var avalancheResult = test(avalancheArray, max);
        console.log(snowBallResult, avalancheResult);
        if (snowBallResult.message != "") { 
            return snowBallResult; //returns error message
        } else if (snowBallResult.N <= avalancheResult.N) { //return snowball
            return {
                method: "Snowball",
                N: snowBallResult.N
            }
        } else {    //return avalanche
            return {
                method: "Avalanche",
                N: avalancheResult.N
            }
        }
    });
}

function test(cards, max) {

    var rates = [];
    var minimumPayments = [];
    var principals = [];
    var minpaymentSum = 0;
    var length = cards.length;
    var N = 0;
    var max = max;

    for (var index = 0; index < length; index++) {  //initialize rates, minimumPayments, principals arrays from user's loans
        rates.push(Math.pow(1 + ((parseFloat(cards[index].interest_rate) / 100) / 360), 30) - 1);
        principals.push(parseFloat(cards[index].balance));
        minimumPayments.push(parseFloat(cards[index].minimum_Payment));
        minpaymentSum += minimumPayments[index];
        if (minpaymentSum > max) { //return error if minimum payment is too low
            return {
                N: 0,
                message: "Total minimum payments exceed allotted monthly amount! Please enter a higher amount to pay or delete loans until your monthly budget is reached."
            };
        }
        if (minimumPayments[index] < rates[index] * principals[index]) { //return error if minimum payment is less than interest accrued
            return {
                N: 0,
                message: "Minimum payments is less than interest accrued on " + cards[index].name + "! Please edit minimum payment or delete this loan."
            };
        }
    }

    for (var i = 0; i < length; i++) { //iteration for each loan
        if (i < length - 1) {
            var minPaymentSum = 0;
            for (var minIndex = i + 1; minIndex < length; minIndex++) { //calculates minimum payment total from other loans
                minPaymentSum += minimumPayments[minIndex];
            }
            var payment = max - minPaymentSum;
            var n = ((-1) * Math.log(1 - rates[i] * principals[i] / payment)) / Math.log(1 + rates[i]); //calculates time to pay off current loan
            N += n; //total months incremented
            for (var balanceIndex = i + 1; balanceIndex < length; balanceIndex++) { //updates principles for remaining loans after n months
                principals[balanceIndex] = principals[balanceIndex] * Math.pow(1 + rates[balanceIndex], n) -
                    (minimumPayments[balanceIndex] / rates[balanceIndex]) * (Math.pow(1 + rates[balanceIndex], n) - 1);
            }
        } else { //executes if this is the last loan
            var n = ((-1) * Math.log(1 - rates[i] * principals[i] / max)) / Math.log(1 + rates[i]);
            N += n; //total months incremented
        }
    }
    return { //return result
        N: N,
        message: ""
    };
}

module.exports = calc1;
