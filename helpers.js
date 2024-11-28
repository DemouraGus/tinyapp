const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const userLookup = function(email, database) {
  for (const id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return null;
};

const urlsForUser = function(id, database) {
  const userUrls = {};
  for (const urlID in database) {
    if (database[urlID].userID === id) {
      userUrls[urlID] = database[urlID];
    }
  }
  return userUrls;
};

module.exports = { generateRandomString, userLookup, urlsForUser };