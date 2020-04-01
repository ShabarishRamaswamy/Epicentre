//Importing Libraries
const { createLogger, format, transports } = require('winston');
const { timestamp } = format;
//const { uploadFile } = require('../src/backup.ts')
require('winston-daily-rotate-file')
const fs = require('fs')
require('winston-daily-rotate-file');
const path = require('path');

//var fileName = require('.env.example')
var fileName = process.env.fileNames || 'test.js'
//continuousBackup()

//Creating Logging directory if not present
if (!fs.existsSync('logger/logs')) {
    fs.mkdirSync('logger/logs');
}

var backupFrequency = 86400000; // expressed in miliseconds
var myInterval = 0;


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
// function continuousBackup() {
//     myInterval = setInterval( uploadFile(fileNames), backupFrequency );  // run
//     myInterval1 = setInterval(loggerlog(`All files : ${fileNames} have been logged`, 0), backupFrequency)
// }

module.exports = loggerlog;
