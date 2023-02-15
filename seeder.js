const dotenv = require('dotenv')
dotenv.config({path:"./config/config.env"})

const fs = require('fs')
const mongoose = require('mongoose')

const BootcampModel = require('./models/BootcampModel')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
})

// read json file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

//import data into DB
const importData = async () => {
    try {
        await BootcampModel.create(bootcamps)
        console.log('Data imported');
        process.exit()
    } catch (error) {
        console.error(error);
    }
}


//delete data from DB
const deleteData = async () => {
    try {
        // if not passed any params, deleteMany will delete all data 
        await BootcampModel.deleteMany()
        console.log('Data imported');
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}
