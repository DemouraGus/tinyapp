const { assert } = require('chai');
const { userLookup } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userLookup', function() {
  it('Should return a user with valid email', function() {
    const user = userLookup('user@example.com', testUsers)
    const expectedUserID = 'userRandomID';
    assert.strictEqual(user.id, expectedUserID)
  });
  it('Should return null with an invalid email', function() {
    const user = userLookup('user@notAnExample.com', testUsers)
    const expectedUserID = null;
    assert.strictEqual(user, expectedUserID)
  });
});