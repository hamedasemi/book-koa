import {
    debug,
    error
} from 'webrew-helpers-log'

import DB from './db'

let db = new DB({
    dbServerPath: 'mongodb://localhost:27017/book'
})

async function start() {
    /**
     * --------------------------------------------------
     * db connection
     * --------------------------------------------------
     */
    let dbConnection = await db.connect()
    debug('connected db:', 'book')


    /**
     * --------------------------------------------------
     * collection selection
     * --------------------------------------------------
     */
    let collection = await db.collection(dbConnection)
    debug('selected collection:', 'hamed')


    /**
     * --------------------------------------------------
     * collection find
     * --------------------------------------------------
     */
    let collectionFind = await db.find(collection, {})
    debug('collection find all:', collectionFind)


    /**
     * --------------------------------------------------
     * collection insert
     * --------------------------------------------------
     */
    collection = await db.insert(collection)
    debug('collection insert all:', 'collectionFind')


    /**
     * --------------------------------------------------
     * db disconnection
     * --------------------------------------------------
     */
    dbConnection.close()
    debug('disconnected db:', 'book')
}

start()