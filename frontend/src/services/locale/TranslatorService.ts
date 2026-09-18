/* const API_URL = 'https://api.mymemory.translated.net/get'

export async function trasnlateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if(sourceLang === targetLang) return text

    const params = new URLSearchParams({q: text.slice(0, 500), langpair: `${sourceLang}|${targetLang}`});
    const res = await fetch(`${API_URL}?${params}`);
    const data = await res.json();

    return data.responseData.translatedText
} */

