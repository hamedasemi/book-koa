import MongoClient from 'mongodb'

export default class DB {
    constructor(options) {
        Object.assign(this, options)
    }
    collection(db) {
        return new Promise((resolve, reject) => {
            let collection = db.collection('hamed', (err) => {
                if (err) {
                    throw err
                } else return setTimeout(function () {
                    return resolve(collection)
                }, 3000);
            })
        })
    }
    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dbServerPath, (err, db) => {
                if (err) error(new Error('Mongodb connection error'), err)
                resolve(db)
            })
        })
    }
    find(collection, query) {
        return new Promise((resolve, reject) => {
            collection.find(query, (err, cursor) => {
                if (err) {
                    throw err
                } else return setTimeout(function () {
                    return resolve(cursor.toArray())
                }, 3000);
            })
        })
    }
    insert(collection) {
        return new Promise((resolve, reject) => {
            collection.insert({
                name: "hmdHAMED"
            }, (err, collection) => {
                if (err) {
                    throw err
                } else return setTimeout(function () {
                    return resolve(collection)
                }, 3000);
            })
        })
    }

}