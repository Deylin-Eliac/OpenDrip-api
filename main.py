from fastapi import FastAPI, Query
from bs4 import BeautifulSoup
import httpx

app = FastAPI()

@app.get("/api/stickerly/search")
async def search_stickers(q: str = Query(..., description="Palabra clave")):
    url = f"https://sticker.ly/s?q={q}"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        if res.status_code != 200:
            return {"ok": False, "error": "No se pudo acceder a sticker.ly"}
        
        soup = BeautifulSoup(res.text, 'html.parser')
        results = []

        for item in soup.select('a[href*="/s/"]'):
            name = item.select_one('div[data-testid="pack-name"]')
            author = item.select_one('div[data-testid="pack-author"]')
            thumb = item.select_one('img')

            if not name or not thumb:
                continue

            results.append({
                "name": name.text.strip(),
                "author": author.text.strip() if author else "Desconocido",
                "thumbnail": thumb['src'],
                "url": "https://sticker.ly" + item['href']
            })

        return {"ok": True, "results": results[:20]}  # solo 20 primeros