var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Got a request');
});

module.exports = router;
