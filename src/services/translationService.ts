export const translateText = async (text: string, sourceLang: string = 'en', targetLang: string = 'es'): Promise<string> => {
    if (!text || text.trim() === '') {
        return '';
    }

    const MAX_CHARS = 450;
    const chunks: string[] = [];
    
    for (let i = 0; i < text.length; i += MAX_CHARS) {
        chunks.push(text.substring(i, i + MAX_CHARS));
    }

    try {
        const translatedChunks: string[] = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${targetLang}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const response = await fetch(url, { 
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            
            if (response.status === 429) {
                if (translatedChunks.length > 0) {
                    return translatedChunks.join('');
                }
                throw new Error('Límite de traducciones alcanzado. Intenta más tarde.');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('MyMemory chunk response:', data);
            
            if (data.responseStatus === 200 && data.responseData?.translatedText) {
                translatedChunks.push(data.responseData.translatedText);
            } else if (data.quotaFinished) {
                throw new Error('Cuota de traducción agotada');
            } else {
                translatedChunks.push(chunk);
            }
        }
        
        const result = translatedChunks.join('');
        return result || text;
        
    } catch (error) {
        console.error('Error translating:', error);
        return text;
    }
};
