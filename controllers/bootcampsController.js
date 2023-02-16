const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/BootcampModel')
const geocoder = require('../utils/Geocoder')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    //advanced filtering based using fields(queryStrings)
    let query
    let queryStr = JSON.stringify(req.query) //need to use query as a string to manipulate it
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`)
    query = Bootcamp.find(JSON.parse(queryStr))

    const bootcamps = await query
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })

})

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found, id: ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true, data: bootcamp
    })
})

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found, id: ${req.params.id}`, 404))
    }
    res.status(201).json({
        success: true, data: bootcamp
    })
})

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found, id: ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: {} })
})

// @desc      Get bootcamps in a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getsBootcampsinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    //get lat/long from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //calc radius using radians
    const radius = distance / 6378
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    res.status(200).json({ succes: true, count: bootcamps.length, data: bootcamps })
})
