var express = require('express'),
    Photo = require('./models').Photo,
    PORT = process.env.PORT || 2222,
    app = express();

    var axios = require('axios'),
        Promise = require('es6-promise').Promise;

app.use(express.static(__dirname + '/../dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../dist/index.html');
})

app.get('/api/photos', function(req,res) {
  var filters = filterBy(req.query),
      sortMethod = sortBy(req.query),
      maxPhotos = req.query.displayNo || 100;

  Photo.find(filters)
    .sort(sortMethod)
    .limit(maxPhotos)
    .exec(function(err, photos) {
      if (err) {
        return res.status(500).send({ error: err });
      }

      res.send({ data: photos });
    });

});

app.get('/api/tags', function(req,res) {
  Photo.distinct('tags', function(err, tags) {
    if(err) {
      return res.status(500).send({ error: err });
    }

    res.send({ data: tags });
  });
});

app.get('/api/embed', function(req,res) {

  if(req.query['instagram_link']) {
    var url = 'https://instagram.com/publicapi/oembed/?omitscript=true&url=' + req.query['instagram_link'];

    axios.get(url)
      .then(function(data) {
        res.send(data.data.html);
    })
    .catch(function(err) {
      console.log('Err: ', err);
      res.status(500).send({ error: err });
    });
  }

})

app.listen(PORT);

function filterBy(query) {
  var filters = {},
      tag = query.tag,
      user = query.user,
      video = query.video,
      lng = query.lng,
      lat = query.lat,
      distance = query.distance || 30000; // 30km | 1000 = 1km | 100000 = 100km

  if (tag) {
    filters.tags = tag;
  }
  if (user) {
    filters["user.username"] = user;
  }
  if(video) {
    filters["type"] = "video";
  }

  if(lng && lat) {
    filters.coordinates = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng,lat]
        },
        $maxDistance: distance
      }
    }
  }

  return filters;
}

function sortBy(query) {
  switch (query.sort_by) {
    case "likes":
      return { likes_count: -1 };
    default:
      return { created_time: -1 };
  }
}