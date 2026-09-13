var express =require('express');
var router = express.Router();
var travelController = require('../controllers/travel');

router.get('/', travelController.travel);

module.exports = router;