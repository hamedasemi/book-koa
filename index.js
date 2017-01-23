import MongoClient from 'mongodb'
import {
    writeFile,
    readFileSync,
    readdir
} from 'fs'
import {
    extname
} from 'path'
import {
    debug,
    error
} from 'webrew-helpers-log'



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

const MONGODB_SERVER = 'mongodb://localhost:27017/book'
const SOURCE_DIRECTORY = './source'

async function start() {


    /**
     * --------------------------------------------------
     * db connection
     * --------------------------------------------------
     */
    let dir = await read(SOURCE_DIRECTORY)
    // debug('connected db:', dir)


    /**
     * --------------------------------------------------
     * db connection
     * --------------------------------------------------
     */
    let db = await connect(MONGODB_SERVER)
    debug('connected db:', 'book')

    let filesData = []
    let books = []
    dir.map((currentFile, higherIndex) => {
        let currentBookRawArray = readFileSync(`./source/${currentFile}`).toString().split(`\n`)
        let dbKey = currentFile.replace(`.txt`, ``).replace(`.`, `-`)
        currentBookRawArray.map((currentRawVerse, index) => {
            currentBookRawArray[index] = {
                [dbKey]: currentRawVerse
            }
        })
        for (let index = 0; index < 6000; index++) {
            books[index] = Object.assign(books[index] || {}, currentBookRawArray[index])
        }
    })

    debug('books:', books)

    // writeFile(`./book.json`, JSON.stringify(books), function (err) {
    //     if (err) {
    //         return console.log(err)
    //     }

    //     console.log("The file was saved!")
    // })
    // debug('books:', verses.length)


    /**
     * --------------------------------------------------
     * collection selection
     * --------------------------------------------------
     */
    let collection = db.collection('books')



    /**
     * --------------------------------------------------
     * collection insert
     * --------------------------------------------------
     */
    await collection.insert(books, function (err, currentCollection) {
        if (err) throw err
        else db.close()
    })
    debug('selected collection:', 'collection insert books')



    /**
     * --------------------------------------------------
     * db disconnection
     * --------------------------------------------------
     */
    
    debug('disconnected db:', 'book')
}

start()