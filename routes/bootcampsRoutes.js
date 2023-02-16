const express = require('express')
const router = express.Router()
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getsBootcampsinRadius } = require('../controllers/bootcampsController')

router.route('/radius/:zipcode/:distance').get(getsBootcampsinRadius)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router