var path = require("path");
var db = require("../models");
var calc1 = require('../logic.js');



module.exports = function (app) {
    app.get('/api/calc1/:max', (req, res) => { //get calling logic.js
        var max = req.params.max;
        calc1(req.user.user_id, max).then(result => { 
            res.send(result);
        });
    })

    app.post("/api/newLoan", function (req, res) { //post for new loans
        db.Loan.create({
            name: req.body.name,
            loan_type: req.body.loan_type,
            balance: req.body.balance,
            interest_rate: req.body.interest_rate,
            minimum_Payment: req.body.minimum_Payment,
            UserUserId: req.user.user_id
        }).then(function () {
            db.Loan.findAll({
                where: { UserUserId: req.user.user_id }
            }).then(function (data) {
                res.json(data);
            });
        });
    })

    app.post("/api/editLoan", function (req, res) { //post for editing loans
        var updateLoan = {
            name: req.body.name,
            loan_type: req.body.loan_type,
            balance: req.body.balance,
            interest_rate: req.body.interest_rate,
            minimum_Payment: req.body.minimum_Payment
        };
        db.Loan.update(updateLoan, {
            where: { name: req.body.editId }
        }).then(function () {
            db.Loan.findAll({
                where: { UserUserId: req.user.user_id }
            }).then(function (data) {
                res.json(data);
            });
        });
    })

    app.get("/api/getUser", function (req, res) { //get for returning a user
        db.Loan.findAll({
            where: { UserUserId: req.user.user_id }
        }).then(function (data) {
            res.json(data);
        });
    });

    app.post("/createAccount", function (req, res) { //post for creating a new account
        var newUser = {
            user_id: req.body.Email,
            user_password: req.body.Password,
            user_first_name: req.body.firstName,
            user_last_name: req.body.lastName
        }

        db.User.create(newUser).then(function (data) {
            res.json(data);
        });
    });

    app.post("/api/delete", function (req, res) {   //post for deleting loans
        var name = req.body.name;
        console.log("in api call now");
        console.log(name);
        db.Loan.destroy({ where: { name: name } }).then(function () {
            db.Loan.findAll({
                where: { UserUserId: req.user.user_id }
            }).then(function (data) {
                res.json(data);
            });
        });
    });

    app.get('/api/loanInfo/:name', (req, res) => {  //get for returning specif loan by name
        var name = req.params.name;
        console.log(name);
        db.Loan.findOne({
            where: { name: name }
        }).then(function (data) {
            console.log(data);
            res.json(data);
        });
    })

    app.post("/api/updateMethod", function (req, res) { //post for updating user's optimum payment method
        var method = {
            user_optimum_payment_method:req.body.method,
        }
        db.User.update(method, {
            where: { user_id: req.user.user_id }
        }).then(function (data) {
            console.log(data);
            res.json(data);
        });
    });

}
