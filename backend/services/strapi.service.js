const axios = require("axios")
const STRAPI_URL=process.env.STRAPI_URL||"http://localhost:1337"
const TOKEN = process.env.STRAPI_API_TOKEN
const TTL_MS = 5*60*1000
const cache = new Map()
const strapi_client = axios.create({
    baseURL: STRAPI_URL,
    headers: TOKEN?{Authorization: `Bearer ${TOKEN}`}:{},
    timeout: 5000,
});
const cachedGet = async(URL) =>{
    const now = Date.now()
    if(cache.has(URL)&&cache.get(URL).expire>now){
        return cache.get(URL).data
    }
    const {data} = await strapi_client.get(URL)
    cache.set(URL, {data, expire: now+TTL_MS})
    return data
}
const get_page= async(slug) =>{
    const data = await cachedGet(`/api/paginas?filters[slug][$eq]=${slug}&populate=*`)
    const items = data.data
    if(!items||items.length == 0){
        return null
    }
    return items[0]
}

const get_all_pages= async() =>{
    const data = await cachedGet("/api/paginas?populate=*")
    return data.data.map(p=>p)
}

const clean_cache= ()=>cache.clear()

module.exports = {get_page, get_all_pages, clean_cache}