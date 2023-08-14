const express = require('express')
const router = express.Router()
const commentsController = require('../controllers/commentsController')


router.route('/')
    .get(commentsController.getAllComments)
    .post(commentsController.createNewComment)
    .patch(commentsController.updateComment)
    .delete(commentsController.deleteComment)

module.exports = router
