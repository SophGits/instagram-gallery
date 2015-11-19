var axios = require('axios'),
    Promise = require('es6-promise').Promise,
    Photo = require('./models').Photo,
    MAX_DEPTH = 50, // maximum no. 'pages' to store in db (over 4000)
    CLIENT_ID = process.env.INSTAGRAM_ACCESS_TOKEN;

function showError(res) { console.log("Error is: ", res); }

function createOrUpdate(val, cb) {

  Photo.findOne({ "photo_id": val.id }, function(err, photo) {
    if(err) {
      cb(err, null);
    } else if(photo === null){
      cb(null, createPhoto(val));
    } else {
      cb(null, updatePhoto(val, photo));
    }
  });
}

function createPhoto(val) {
  console.log("Creating...");
  var coords = [],
      video_link;

  if (!!val.videos) {
    try {
      video_link = val.videos.standard_resolution.url;
    } catch (err) {
      console.log('Create video error:', err)
    }
  }
  if (!!val.location) {
    try {
      coords.push(val.location["longitude"]);
      coords.push(val.location["latitude"]);
    } catch (err) {
      console.log('Create photo coords error:', err)
    }
  }

  return new Photo({
    tags: val.tags,
    created_time: new Date(val.created_time * 1e3),
    instagram_link: val.link,
    video_url: video_link,
    image_url: val.images.standard_resolution.url,
    photo_id: val.id,
    user: val.user,
    likes_count: val.likes.count,
    type: val.type,
    coordinates: coords,
    location: val.location
  });
}

function updatePhoto(val, photo) {
  console.log("Updating...");

  photo.tags = val.tags;
  photo.likes_count = val.likes.count;
  photo.location = val.location;
  return photo;
}

function fetchPage(url, depth) {
  if(depth >= MAX_DEPTH) { return; }

  axios.get(url)
    .then(function(res) {
      var nextUrl = res.data.pagination.next_url;

      console.log("________Page", depth +1, "_________");
      res.data.data.forEach(function(val, i) {
        createOrUpdate(val, function(err, photo) {
          if(err) { return showError('Create or Update error: ',err); }

          photo.save(function(err) {
            if(err) { return showError("Save error: ",err); }
            console.log("Saved photo #",i+1);
          })
        });

      });
      fetchPage(nextUrl, depth+1);
    })
    .catch(showError);
}

var url = "https://api.instagram.com/v1/tags/catsinboxes/media/recent?client_id=" + CLIENT_ID;
fetchPage(url, 0);