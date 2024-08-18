export const setStorageItem = (key: any, value: any) => {
    console.log('setting', key, value)
    window.Telegram.WebApp.CloudStorage.setItem(key, value)
}