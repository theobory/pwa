const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pwa-project-14ef8-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();
module.exports = { admin, db };
