const express = require('express')
const cors = require('cors');
const app = express();

app.use(cors());

const serverOptions = {
    host: 'localhost',
    port: 8081,
    routes: {
        cors: {
            origin: ['*']
        }
    }
};

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(serverOptions.port, () => {
    console.log(`Example app listening on port ${serverOptions.port}`)
})
