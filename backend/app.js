require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
/*app.use(express.static("../frontend", {
    etag: false,
    maxAge: 0,
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-store');
    }
}))*/
app.use(express.static(path.join(__dirname, '../frontend')))

app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(500).json({error: "Error interno del servidor"})
})

app.listen(PORT, ()=>{
    console.log(`Express activo en el puerto ${PORT}`)
})