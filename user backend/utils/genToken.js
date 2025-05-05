const jwt = require('jsonwebtoken');

const genToken = (user) => {
    return jwt.sign({email: user.email, id: user._id}, 'secret');    // secure the secret key****
}

module.exports = genToken;