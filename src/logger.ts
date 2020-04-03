//Importing Libraries
const { createLogger, format, transports } = require('winston');
const path = require('path');
const { timestamp } = format;
// const uploadFile = require('../src/backup.js');
import uploadFile from "./backup";
require('winston-daily-rotate-file');
const fs = require('fs');
require('winston-daily-rotate-file');

//var fileName = require('.env.example')
let fileName = process.env.fileNames || 'test.js'
let logfilelocation,  dailylogfilelocation
let backupFrequency = 1000; // 12 hours expressed in miliseconds
continuousBackup()

//Creating Logging directory if not present
if (!fs.existsSync('logger/logs')) {
    fs.mkdirSync('logger/logs');
}

fs.readdir('logger/logs/', (err, files)=>{
    files.forEach((file)=>{
        if (file == 'fileslogger.log'){
            logfilelocation = 'logger/log/' + file
        }else{
            dailylogfilelocation = 'logger/log/'+file
        }
    })
})



const dailyRotateFileTransport = new transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename:   `logger/logs/epicenter-daily.log`
});

const logger = createLogger({
    level: process.env.LOGGING_LEVEL || 'silly',
    format: format.combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.level}: ${info.message} at ${info.timestamp}`)
            )
        }),
        new transports.File({ filename: 'logger/logs/fileslogger.log' }),
        dailyRotateFileTransport
    ]
});

function logMessage (level:string,message:any) {
    logger.log({
        level,
        message: `${message}`
    });
}

// Adding Backup to logs
async function continuousBackup() {
    try{
        setInterval(()=>{
            uploadFile(logfilelocation),
            uploadFile(dailylogfilelocation),
            logMessage('info',`All files : ${fileName} have been logged`)
        }, backupFrequency );  // run
    } catch(e){
        console.log(e)
    }
}

export {logMessage as log}