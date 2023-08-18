require('dotenv').config(); // Load .env file
require('express-async-errors')
const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbCon')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3100;

console.log(process.env.NODE_ENV)

connectDB()
app.use(express.json({limit: '10mb'}));
app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use(cookieParser())


app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/events', require('./routes/eventRoutes'))
app.use('/comments', require('./routes/commentRoutes'))


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
