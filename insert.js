import { debug, error, info, warn } from './io-log'
import fs, { writeFile, readFileSync, readdir } from 'fs'
import { extname } from 'path'
import MongoClient from 'mongodb'
import util from 'util'
import stream from 'stream'
import es from 'event-stream'

const MONGODB_SERVER = 'mongodb://localhost:27017/book'
const TRANSLATIONS_SOURCE_DIRECTORY = './source/translations'
const LANGUAGE_ABBRIVIATION_LENGTH = 2
const FILE_NAME_SEPERATOR = '.'
const ACCEPTED_SEPERATOR = '-'
const FILE_EXTENSION = '.txt'
const BOOK_NAME = 'quran'

const METADATA_TEMPLATE = {
    NAME: '#  Name: ',
    TRANSLATOR: '#  Translator: ',
    ID: '#  ID: ',
    LASTUPDATE: '#  Last Update:',
    SOURCE: '#  Source: ',
}

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
        let fileList = await read(TRANSLATIONS_SOURCE_DIRECTORY)
        debug('read dir:', fileList)
        let book = {}
        fileList.map((file) => {


            // Books Metadata
            book.id = file.split(FILE_EXTENSION)[0].replace(FILE_NAME_SEPERATOR, ACCEPTED_SEPERATOR)
            book.language = file.split(FILE_NAME_SEPERATOR)[0]
            book.translator = file.split(FILE_NAME_SEPERATOR)[1].split(FILE_EXTENSION)[0]
            book.name = BOOK_NAME

            info(book)

            let metadata = {}
            let collection = db.collection(book.id)
            // collection.insert({metadata: {}, context: []})
            let lineNumber = 0
            let stream = fs.createReadStream(TRANSLATIONS_SOURCE_DIRECTORY + '/' + file)
                .pipe(es.split())
                .pipe(es.mapSync(function (line) {
                    stream.pause()
                    lineNumber += 1
                    let firstChar = line.slice(0, 1)
                    if (firstChar === '#') {
                        if (line.match(METADATA_TEMPLATE.NAME)) metadata.name = line.split(METADATA_TEMPLATE.NAME)[1]
                        if (line.match(METADATA_TEMPLATE.TRANSLATOR)) metadata.translator = line.split(METADATA_TEMPLATE.TRANSLATOR)[1]
                        if (line.match(METADATA_TEMPLATE.ID)) metadata.id = line.split(METADATA_TEMPLATE.ID)[1]
                        if (line.match(METADATA_TEMPLATE.LASTUPDATE)) metadata.lastUpdate = line.split(METADATA_TEMPLATE.LASTUPDATE)[1]
                        if (line.match(METADATA_TEMPLATE.SOURCE)) metadata.source = line.split(METADATA_TEMPLATE.SOURCE)[1]
                    } else if (firstChar === ' ' || firstChar === '\n') {
                        // Ignore lines start wich character: space
                    } else {
                        // let doc = {
                        //     index: lineNumber
                        // }
                        // doc[book.id] = line
                        // collection.insert(doc)
                        // debug(lineNumber + ':', doc)
                    }
                    stream.resume()
                })
                    .on('error', function (err) {
                        console.log('Error while reading file.', err)
                    })
                    .on('end', function () {
                        let stream2 = fs.createReadStream(TRANSLATIONS_SOURCE_DIRECTORY + '/' + file)
                            .pipe(es.split())
                            .pipe(es.mapSync(function (line) {
                                stream2.pause()
                                lineNumber += 1
                                let firstChar = line.slice(0, 1)
                                if (firstChar === '#') {
                                    // if (line.match(METADATA_TEMPLATE.NAME)) metadata.name = line.split(METADATA_TEMPLATE.NAME)[1]
                                    // if (line.match(METADATA_TEMPLATE.TRANSLATOR)) metadata.translator = line.split(METADATA_TEMPLATE.TRANSLATOR)[1]
                                    // if (line.match(METADATA_TEMPLATE.ID)) metadata.id = line.split(METADATA_TEMPLATE.ID)[1]
                                    // if (line.match(METADATA_TEMPLATE.LASTUPDATE)) metadata.lastUpdate = line.split(METADATA_TEMPLATE.LASTUPDATE)[1]
                                    // if (line.match(METADATA_TEMPLATE.SOURCE)) metadata.source = line.split(METADATA_TEMPLATE.SOURCE)[1]
                                } else if (firstChar === ' ' || firstChar === '\n') {
                                    // Ignore lines start wich character: space
                                } else {
                                    let doc = {
                                        index: lineNumber
                                    }
                                    doc[book.id] = line
                                    doc['translator'] = metadata.translator
                                    collection.insert(doc)
                                    debug(lineNumber + ':', doc)
                                }
                                stream2.resume()
                            })
                                .on('error', function (err) {
                                    console.log('Error while reading file.', err)
                                })
                                .on('end', function () {
                                    info(metadata)
                                })
                            )
                    })
                )
        })



    } catch (err) {
        error(err)
    }

}

start('my app')