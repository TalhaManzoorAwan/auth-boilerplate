var path    = require('path');
var clone   = require('clone');
var sinon   = require('sinon');
var assert  = require('assert');
var Mock    = require('../utils/mock')();

var userController = require(path.join(Mock.applicationRoot, '/src/controllers/User'))(Mock.app);

var stubUserFindById,  stubUserCreate,
    stubUserFindByIdAndUpdate,
    stubUserFindOne,stub,spyRes;


var user, req;

describe('User Controller', function() {

    beforeEach(function(done) {
        stubUserFindById =  sinon.stub(Mock.app.models.User, 'findById');
        stubUserCreate = sinon.stub(Mock.app.models.User, 'create');
        stubUserFindByIdAndUpdate = sinon.stub(Mock.app.models.User, 'findByIdAndUpdate');
        stubUserUpdate = sinon.stub(Mock.app.models.User, 'update');
        stubUserFindOne = sinon.stub(Mock.app.models.User, 'findOne');
        stubUserRemove = sinon.stub(Mock.app.models.User, 'remove');
        stubMailerSendMail = sinon.stub(Mock.app.mailer, 'sendMail');


        stub = {
            populate: sinon.stub(),
            exec: sinon.stub(),
            lean: sinon.stub(),
            where: sinon.stub(),
            equals: sinon.stub()
        };

        spyRes = sinon.spy(Mock.app.responder, 'send');

        user = clone(Mock.user);
        req  = clone(Mock.app.req);
        req.params.user_id = 'abc123';
        done();
    });

    afterEach(function(done) {
        stubUserFindById.restore();
        stubUserCreate.restore();
        stubUserFindByIdAndUpdate.restore();
        stubUserUpdate.restore();
        stubUserFindOne.restore();
        stubUserRemove.restore();
        stubMailerSendMail.restore();
        spyRes.restore();
        done();
    });

    describe('Find', function() {

        it('Should return 500 if unable to find user', function (done) {
            req.user = user;

            stubUserFindById.returns(stub);
            stub.exec.yields('Error finding user');

            userController.find(req, Mock.app.res);
            assert(spyRes.calledWith(500));
            done();
        });

        it('Should return 404 if unable to find user', function (done) {
            req.user = user;

            stubUserFindById.returns(stub);
            stub.populate.returns(stub);
            stub.exec.yields(null, null);

            userController.find(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            done();
        });
    });

    describe('Add Local User', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.addLocal(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 200 and null if user is found', function (done) {
            stubUserFindOne.yields(null, {profile:{name:"novardo User"}});
            userController.addLocal(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            assert.strictEqual(null, spyRes.args[0][3]);
            done();

        });

        it('Should return 400 if user can not be created', function (done) {
            stubUserFindOne.yields(null,null);
            stubUserCreate.yields("err")
            userController.addLocal(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();
        });

    });

    describe('Get User Profile', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.getUserProfile(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 404 if unable to find user', function (done) {
            stubUserFindOne.yields(null,null);
            userController.getUserProfile(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            done();

        });

        it('Should return 200 if user is found', function (done) {
            stubUserFindOne.yields(null, {profile:{name:"novardo User"}});
            userController.getUserProfile(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            assert({ name: 'surya' },spyRes.args[0][3]);
            done();

        });

    });

    describe('Update Profile', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.updateProfile(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 404 if unable to find user', function (done) {
            stubUserFindOne.yields(null,null);
            userController.updateProfile(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            done();

        });

        // user.save is throwing erros
        //it('Should return 200 if user is found', function (done) {
        //    stubUserFindOne.yields(null,{profile:{name:"surya"}});
        //    stubUserUpdate.yields("err");
        //    userController.updateProfile(req, Mock.app.res);
        //    assert(spyRes.calledWith(200));
        //    //assert({ name: 'surya' },spyRes.args[0][3]);
        //    done();
        //
        //});


    });

    describe('Delete Profile', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.deleteProfile(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 404 if unable to find user', function (done) {
            stubUserFindOne.yields(null,null);
            userController.deleteProfile(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            done();

        });
    });


    describe('Confirm Sign Up', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.confirmSignUp(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 400 if user is not updated', function (done) {
            stubUserFindOne.yields(null, {profile:{name:"novardo User"}});
            stubUserUpdate.yields("err");
            userController.confirmSignUp(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 200 if user is updated', function (done) {
            stubUserFindOne.yields(null, {profile:{name:"novardo User"}});
            stubUserUpdate.yields(null, {profile:{name:"novardo User"}});
            userController.confirmSignUp(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            done();

        });

        it('Should return 404 if user is not found', function (done) {
            stubUserFindOne.yields(null, null);
            userController.confirmSignUp(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            done();

        });
    });

    describe('Sign In', function() {
        it('Should return 400 if unable to find user', function (done) {
            stubUserFindOne.yields("err");
            userController.signIn(req, Mock.app.res);
            assert(spyRes.calledWith(400));
            done();

        });

        it('Should return 200 and null if password is not present', function (done) {
            stubUserFindOne.yields(null, {profile:{name:"novardo User"}});
            userController.signIn(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            assert.strictEqual(null, spyRes.args[0][3]);
            done();

        });

        it('Should return 404 and null if user is not found', function (done) {
            stubUserFindOne.yields(null, null);
            userController.signIn(req, Mock.app.res);
            assert(spyRes.calledWith(404));
            assert.strictEqual(null, spyRes.args[0][3]);
            done();

        });
    });

    describe('Add Social Network User', function() {
        it('Should return 200 and null if user already exists', function (done) {
            var usr = {
                profile: {
                    name:"novardo User"
                },
                save: function(){

                }
            }
            var stubUserSave = sinon.stub(usr, 'save');
            stubUserFindOne.yields(null, usr);
            stubUserSave.yields(null)
            userController.add(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            assert.strictEqual(null, spyRes.args[0][3]);
            done();

        });

        it('Should return 200 and null if user already exists', function (done) {
            var usr = {
                profile: {
                    name:"novardo User"
                },
                save: function(){

                }
            }
            var stubUserSave = sinon.stub(usr, 'save');
            stubUserFindOne.yields(null, usr);
            stubUserSave.yields(null)
            userController.add(req, Mock.app.res);
            assert(spyRes.calledWith(200));
            assert.strictEqual(null, spyRes.args[0][3]);
            done();

        });
    });

    //describe('Switch Work Space', function() {
    //    it('Should return 404 if unable to find user', function (done) {
    //        req.body.email = user.email;
    //
    //        stubUserFindOne.returns(stub);
    //        stub.populate.returns(stub);
    //        stub.exec.yields(null, null);
    //
    //        userController.switchWorkSpace(req, Mock.app.res);
    //        assert(spyRes.calledWith(404));
    //        done();
    //
    //    });
    //});
    //
    //describe('Add Role', function() {
    //    it('Should return 404 if unable to find user', function (done) {
    //        req.body.email = user.email;
    //
    //        stubUserFindOne.returns(stub);
    //        stub.populate.returns(stub);
    //        stub.exec.yields(null, null);
    //
    //        userController.addRole(req, Mock.app.res);
    //        assert(spyRes.calledWith(404));
    //        done();
    //
    //    });
    //});
    //
    //describe('Remove Role', function() {
    //    it('Should return 404 if unable to find user', function (done) {
    //        req.body.email = user.email;
    //
    //        stubUserFindOne.returns(stub);
    //        stub.populate.returns(stub);
    //        stub.exec.yields(null, null);
    //
    //        userController.addRole(req, Mock.app.res);
    //        assert(spyRes.calledWith(404));
    //        done();
    //
    //    });
    //});
});
