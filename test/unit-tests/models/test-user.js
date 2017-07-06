var assert = require('assert');
var sinon  = require('sinon');
var path   = require('path');
var Mock    = require('../utils/mock')();
var mongoose = require('mongoose');
var moment = require('moment');
var userModel = require(path.join(Mock.applicationRoot, '/src/models/User'))(Mock.app);
var models = {
    realtor: mongoose.model('RealtorSchema', userModel.RealtorSchema),
    buyer: mongoose.model('BuyerSchema', userModel.BuyerSchema)
};


describe('User Model', function() {

    beforeEach(function(done) {
        done();
    });

    afterEach(function(done) {
        done();
    });

    describe('User Schema', function() {

        describe('Realtor Schema', function() {
            it('Should set the updated property to current time', function(done) {
                var user = new models.realtor({realtor: '123'});
                user.save();
                assert.equal(moment(user.updated).format('hh:mm'), moment().format('hh:mm'))
                done();
            });
        });

        describe('Buyer Schema', function() {
            it('Should set the updated property to current time', function(done) {
                var user = new models.buyer({buyer: '123'});
                user.save();
                assert.equal(moment(user.updated).format('hh:mm'), moment().format('hh:mm'))
                done();
            });
        });

        describe('User Schema', function() {
            it('Should return full name if both first and last name exist', function(done) {
                var user = new userModel.schema.model({profile: {name: {first: 'tom', last: 'jerry'}}, email: 'jerry@tom.com'});
                assert.equal(user.profile.name.full, 'tom jerry');
                done();
            });
        });
    });
});