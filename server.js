const dotenv = require('dotenv')
dotenv.config({path:"./config/config.env"})

const express = require('express')
const morgan = require('morgan')

const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

const bootcampRoute = require('./routes/bootcampsRoutes')


connectDB()

const app = express()
app.use(express.json())

//dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcampRoute)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port: ${PORT}`);
})