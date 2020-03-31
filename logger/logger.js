const { createLogger, format, transports } = require('winston');
const { timestamp } = format;
require('winston-daily-rotate-file')
const fs = require('fs')
require('winston-daily-rotate-file');
if (!fs.existsSync('logger/logs')) {
    fs.mkdirSync('logger/logs');
}
const path = require('path');
//var fileName = require('.env.example')
var fileName = 'test.js'

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename:   `logger/logs/epicenter-daily.log`,
    datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
    level: 'silly',
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
//Log Names
if(lvl == 0){
    logger.log({
        level: 'info',
        message: msg
    })
}else if(lvl == 1){
    logger.log({
        level: 'error',
        message: msg
    })
}
//Refrence
// logger.log({
//     level: 'info',
//     message: `${fileName} Has been logged`
// });
}

module.exports = loggerlog;
