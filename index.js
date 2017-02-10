import { debug, error, info, warn } from './io-log'
import what from './what.js'


let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

async function start(name, {}={}) {
    debug('app:', name, 'start')

    try {
        await what()
    } catch (err) {
        error(new Error('index'))
        error(err)
    }

    myArray.map(() => {
        debug('2 now')

    })

}

start('my app')