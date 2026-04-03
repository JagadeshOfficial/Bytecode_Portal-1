const express = require('express');
const router = express.Router();
const { 
    getCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse 
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getCourses)
    .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('ADMIN', 'SUPER_ADMIN'), updateCourse)
    .delete(protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteCourse);

module.exports = router;
