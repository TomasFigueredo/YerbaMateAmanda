const {get_page, get_all_pages, clean_cache} = require("../services/strapi.service")

exports.getPage = async(req, res) =>{
    try{
        const {slug} = req.params
        const page = await get_page(slug)
        if(!page){
            return res.status(404).json({error: "Pagina no encontrada"})
        }
        if(!page.activa){
            return res.status(404).json({error: "La pagina no esta activa"})
        }
        res.json(page)
    }catch(error){
        console.error(`Error en cargar contenido ${error.message}`)
        res.status(500).json({error: "Error al obtener el contenido"})
    }
}

exports.getAllPages = async(req, res) =>{
    try{
        const allPages = await get_all_pages()
        return res.json(allPages)
    }catch(error){
        console.error(`Error en cargar contenido ${error.message}`)
        res.status(500).json({error: "Error al obtener el contenido"})
    }
}