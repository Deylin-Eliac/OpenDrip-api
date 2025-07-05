# api/stickerly.py
import requests
from bs4 import BeautifulSoup

def handler(request):
    query = request.query.get('q')
    if not query:
        return {
            "statusCode": 400,
            "body": "Parámetro 'q' requerido"
        }

    url = f'https://sticker.ly/s?q={query}'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []

        for a in soup.select('a[href^="/s/"]'):
            name_tag = a.select_one('.pack-name')
            author_tag = a.select_one('.pack-author')
            img_tag = a.find('img')

            if not name_tag or not img_tag:
                continue

            results.append({
                "name": name_tag.text.strip(),
                "author": author_tag.text.strip() if author_tag else '',
                "thumbnail": img_tag['src'],
                "url": "https://sticker.ly" + a['href']
            })

        return {
            "statusCode": 200,
            "headers": { "Content-Type": "application/json" },
            "body": {
                "status": True,
                "creator": "Deylin",
                "result": results
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "error": "Error al buscar en sticker.ly",
                "detail": str(e)
            }
        }