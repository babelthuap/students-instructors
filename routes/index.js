var express = require('express');
var router = express.Router();

router.get('/express', function(req, res, next) {
  res.render('index', { title: 'React' });
});

var links = [
  {id: 1, title: "Google", url: "https://google.com"},
  {id: 2, title: "XKCD", url: "http://xkcd.com"}
];

// router.get('/api/links', function(req, res, next) {
//    res.json({ links: links });
// });

// router.post('/api/links', function(req, res, next) {
//    var newLink = req.body;
//    newLink.id = Date.now();
//    links.push(newLink);
//    res.json(newLink);
// });

module.exports = router;
