const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
connectToMongo();

const app = express();
port = 5000;

// It is used so that we can use the body of request
app.use(express.json())
app.use(cors())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port,()=>{
    console.log("App listening at port " + port);
})
