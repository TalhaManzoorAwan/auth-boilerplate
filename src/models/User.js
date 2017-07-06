var mongoose  = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = function(){
    var mongoose  = require('mongoose');

    var UserSchema = new Schema({
        name:  { type: String, required: true},
        email:  { type: String, lowercase: true, index: { unique: true }},
        userName: { type: String },
        password:  { type: String },
        providerType:  { type: String },
        providerId:  { type: String },
        token:  { type: String },
        confirmationStatus : { type:Boolean, required: true,default: false},
        role : { type: String ,  enum: ['Teacher', 'Student']},
        deleted: {type: Boolean, required: true, default: false},
        deletedAt: { type: Date},
        createdAt: { type: Date, required: true, 'default': Date.now},
        updatedAt: { type: Date, required: true, 'default': Date.now}
    });

    return mongoose.model("User", UserSchema);
};




