import aiohttp
from config.settings import UNSPLASH_ACCESS_KEY

async def get_unsplash_image(search_term):
    url = "https://api.unsplash.com/photos/random"
    params = {
        "query": search_term,
        "client_id": UNSPLASH_ACCESS_KEY,
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as resp:
            data = await resp.json()
            image_url = data.get("urls", {}).get("regular", "")
            return image_url