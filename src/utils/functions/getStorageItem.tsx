export const getStorageItem = async (key: string) => {
    return new Promise((resolve, reject) => {
        window.Telegram.WebApp.CloudStorage.getItem(key, (err, value: any) => {
            if (err || !value) {
                console.log('IT IS NOT STORED')
                return reject(new Error('Data is not stored'))
            } else {

                resolve(value)
            }
        })
    })
}