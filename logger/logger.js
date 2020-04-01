//Importing Libraries
const { createLogger, format, transports } = require('winston');
const { timestamp } = format;
const { uploadFile } = '../src/backup.ts'
require('winston-daily-rotate-file')
const fs = require('fs')
require('winston-daily-rotate-file');
const path = require('path');

//var fileName = require('.env.example')
let fileName = process.env.fileNames || 'test.js'
let logfilelocation,  dailylogfilelocation
let backupFrequency = 43200000; // 12 hours expressed in miliseconds
let myInterval = 0;
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


const loggerlog =(msg, lvl)=>{
// Log Names
if(lvl == 0){
    logger.log({
        level: process.env.INFO_LEVEL || 'info',
        message: msg
    })
}else if(lvl == 1){
    logger.log({
        level: process.env.ERROR_LEVEL || 'error',
        message: msg
    })
}
// Refrence
// logger.log({
//     level: 'info',
//     message: `${fileName} Has been logged`
// });
}

// Adding Backup to logs
function continuousBackup() {
    myInterval = setInterval(()=>{
        uploadFile(logfilelocation),
        uploadFile(dailylogfilelocation),
        loggerlog(`All files : ${logfileNames} have been logged`, 0)
    }, backupFrequency );  // run
}

module.exports = loggerlog;
