### Instagram-fuelled photo gallery
Prototype app for displaying media from the Instagram API with custom filters and sorts.

##### Quickstart
*`npm start` to start the server
*`npm run build` to bundle the modules (and convert JSX into JS)
*`npm run watch-css` to keep an eye on the CSS
*Requires Instagram access token and mongo db.

##### Todo
* Sorting by something invalid, such as `sort_by=likes_count` instead of just `likes` the default behaviour results and there is no error warning.
* Importer script never terminates in console because the mongoose connection is never closed (? potentially). One way to solve this would be to promisify the FetchPage function (and its iteratees), then call Promise.all() to run a fn to exit the mongoose process.
* Handle removed photos which 404 you.
* Look into Levenshtein distance for location names.
* Handle `null` tags at the importer phase (rather then filtering phase).