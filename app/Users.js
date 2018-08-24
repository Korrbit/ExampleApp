var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10,
  // these values can be whatever you want - we're defaulting to a
  // max of 5 attempts, resulting in a 2 minute lock
  MAX_LOGIN_ATTEMPTS = 5,
  LOCK_TIME = 2 * 60 * 1000;

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var userSchema = new mongoose.Schema({
  name: {
    first: String,
    last: { type: String, trim: true }
  },
  account: {
    name: { type: String, required: true, index: { unique: true } },
    password: String
  },
  // new properties
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  cyberData: {
    results: Object
  }
});

userSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// hash password prior to saving or updating
userSchema.statics.hashPassword = function(password, cb) {
    var user = this;
    console.log('starting password modification for save...');
    console.log(password);
    // only hash the password if it has been modified (or is new)
    //if (!user.account.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return cb(err);

        // hash the password using our new salt
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) return cb(err);

            // override the cleartext password with the hashed one
            password = hash;
            console.log(password);
            return cb(null, password);
        });
    });
};


userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.account.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


userSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ 'account.name' : username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'TestUsers' collection in the MongoDB database
module.exports = mongoose.model('TestUsers', userSchema);
