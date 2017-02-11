import { debug, error, info, warn } from './io-log'
import fs, { writeFile, readFileSync, readdir } from 'fs'
import { extname } from 'path'
import MongoClient from 'mongodb'
import util from 'util'
import stream from 'stream'
import es from 'event-stream'
import lodash from 'lodash'

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
        
        let myColl = db.collection('fa.makarem.txt')
        let myColl2 = db.collection('en.daryabadi.txt')
        let res1 = await myColl.find({}).skip(5000).limit(10).toArray()
        let res2 = await myColl2.find({}).skip(5000).limit(10).toArray()
        let res = lodash.merge(res1, res2)
        console.log(res)
        



    } catch (err) {
        error(err)
    }

}

start('my app')