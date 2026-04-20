const express = require("express")
const router = express.Router()
const content_controller = require('../controllers/content.controller')

router.get("/", content_controller.getAllPages)
router.get("/:slug", content_controller.getPage)

module.exports = router