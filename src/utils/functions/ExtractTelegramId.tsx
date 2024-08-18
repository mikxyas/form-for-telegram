export const  ExtractTelegramId = (unextracted: any) => {
    const extracted = decodeURIComponent(unextracted)
    // console.log(extracted)
    const telegram_id: number = JSON.parse(extracted.split('&')[0].split('=')[1]).id
    // console.log(telegram_id)
    return telegram_id.toString()
}