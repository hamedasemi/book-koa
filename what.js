export default function what() {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve()
            // reject(new Error('what method says: broken', 'fdd'))
        }, 2000)

    })
}