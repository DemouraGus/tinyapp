const { assert } = require('chai');
const { userLookup, urlsForUser } = require('../helpers.js');

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
    const user = userLookup('user@example.com', testUsers);
    const expectedUserID = 'userRandomID';
    assert.strictEqual(user.id, expectedUserID);
  });
  it('Should return null with an invalid email', function() {
    const user = userLookup('user@notAnExample.com', testUsers);
    const expectedUserID = null;
    assert.strictEqual(user, expectedUserID);
  });
});

describe('urlsForUser', function() {
  it('should return URLs that belong to the specified user', function() {
    const urlDatabase = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "user2" },
      sgq3y6: { longURL: "https://www.example.com", userID: "user1" }
    };

    const userID = "user1";
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
      sgq3y6: { longURL: "https://www.example.com", userID: "user1" }
    };

    const result = urlsForUser(userID, urlDatabase);

    assert.deepEqual(result, expectedOutput, "The returned URLs do not match the expected output for the specified user");
  });
  it('should return an empty object if the user has no URLs', function() {
    const urlDatabase = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "user2" },
      sgq3y6: { longURL: "https://www.example.com", userID: "user1" }
    };

    const userID = "user3"; // This user has no URLs in the database
    const expectedOutput = {};

    const result = urlsForUser(userID, urlDatabase);

    assert.deepEqual(result, expectedOutput, "The function did not return an empty object for a user with no URLs");
  });
  it('should return an empty object if there are no URLs in the urlDatabase', function() {
    const urlDatabase = {}; // Empty database

    const userID = "user1"; // Any userID
    const expectedOutput = {};

    const result = urlsForUser(userID, urlDatabase);

    assert.deepEqual(result, expectedOutput, "The function did not return an empty object for an empty urlDatabase");
  });
  it('should not return URLs that do not belong to the specified user', function() {
    const urlDatabase = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "user2" },
      sgq3y6: { longURL: "https://www.example.com", userID: "user1" }
    };

    const userID = "user1";
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
      sgq3y6: { longURL: "https://www.example.com", userID: "user1" }
    };

    const result = urlsForUser(userID, urlDatabase);

    // Assert that the result matches the expected output
    assert.deepEqual(result, expectedOutput, "The function returned URLs that do not belong to the specified user");

    // Assert that URLs not belonging to the user are not included
    assert.isUndefined(result['i3BoGr'], "The function included a URL that does not belong to the specified user");
  });
});