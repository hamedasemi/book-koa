import MongoClient from 'mongodb'
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

const MONGODB_SERVER = 'mongodb://localhost:27017/book'

async function start() {
    /**
     * --------------------------------------------------
     * db connection
     * --------------------------------------------------
     */
    let db = await connect(MONGODB_SERVER)
    debug('connected db:', 'book')


    /**
     * --------------------------------------------------
     * collection selection
     * --------------------------------------------------
     */
    let collection = db.collection('hamed')
    debug('selected collection:', 'hamed')


    /**
     * --------------------------------------------------
     * collection find
     * --------------------------------------------------
     */
    let collectionFind = await collection.find({}, (err, cursor) => {
        if (err) { throw err } else return cursor.toArray()
    })
    debug('collection find all:', collectionFind)

    
    /**
     * --------------------------------------------------
     * collection insert
     * --------------------------------------------------
     */
    // await collection.insert({name: "hmdHAMED"}, function(err, collection) {
    //     if(err) {throw err } else return collection
    // })
    
    
    /**
     * --------------------------------------------------
     * db disconnection
     * --------------------------------------------------
     */
    db.close()
    debug('disconnected db:', 'book')
}

start()