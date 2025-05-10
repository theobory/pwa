const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute.js');
const boardsRoute = require('./routes/boardsRoute.js');
const columnsRoute = require('./routes/columnsRoute');
const tasksRoute = require('./routes/tasksRoute');
const userRoute = require('./routes/userRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoute);
app.use('/api/boards', boardsRoute);
app.use('/api/columns', columnsRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    res.send('API-PWA');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
