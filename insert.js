import { debug, error, info, warn } from './io-log'
import fs, { writeFile, readFileSync, readdir } from 'fs'
import { extname } from 'path'
import MongoClient from 'mongodb'
import util from 'util'
import stream from 'stream'
import es from 'event-stream'

const MONGODB_SERVER = 'mongodb://localhost:27017/book'
const SOURCE_DIRECTORY = './source'

function connect(server) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(server, (err, db) => {
            if (err) error(new Error('Mongodb connection error'), err)
            resolve(db)
        })
    })
}

function read(directory) {
    return new Promise((resolve, reject) => {
        readdir(directory, (err, files) => {
            if (err) error(new Error('Read source dir'), err)
            resolve(files.filter(file => {
                return extname(file) === `.txt`
            }));
        })
    })
}

async function start(name, {} = {}) {
    debug('app:', name, 'start')

    try {
        let db = await connect(MONGODB_SERVER)
        debug('connected db:', 'book')
        let fileList = await read(SOURCE_DIRECTORY)
        debug('read dir:', fileList)

        fileList.map((file) => {
            let collection = db.collection(file)
            let lineNr = 0
            console.log(SOURCE_DIRECTORY + '/' + file)
            let stream = fs.createReadStream(SOURCE_DIRECTORY + '/' + file)
                .pipe(es.split())
                .pipe(es.mapSync(function (line) {
                    stream.pause()

                    lineNr += 1

                    // process line here and call s.resume() when rdy
                    // function below was for logging memory usage
                    debug(lineNr + ': ' + line)
                    
                    let doc = {
                        index: lineNr
                    }
                    
                    doc[file.replace('.', '-').split('.txt')] = line
                    collection.insert(doc)

                    // resume the readstream, possibly from a callback
                    stream.resume()
                })
                    .on('error', function (err) {
                        console.log('Error while reading file.', err)
                    })
                    .on('end', function (err) {
                        console.log('Read entire file.', err)
                    })
                )
        })



    } catch (err) {
        error(err)
    }

}

start('my app')