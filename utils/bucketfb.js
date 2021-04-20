const admin = require("firebase-admin");
const autentificacionFB = require("../digitalclubs-358f2-firebase-adminsdk-5lbh4-8fb94306cf.json");

admin.initializeApp({
  credential: admin.credential.cert(autentificacionFB),
  storageBucket: "digitalclubs-358f2.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
