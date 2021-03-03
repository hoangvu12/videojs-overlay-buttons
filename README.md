# videojs-touch-overlay

Touch overlay for player

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation

```sh
npm install --save videojs-touch-overlay
```

## Usage

To include videojs-touch-overlay on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-touch-overlay.min.js"></script>
<script>
  var player = videojs('my-video');

  player.touchOverlay();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-touch-overlay via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-touch-overlay');

var player = videojs('my-video');

player.touchOverlay();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-touch-overlay'], function(videojs) {
  var player = videojs('my-video');

  player.touchOverlay();
});
```

## License

MIT. Copyright (c) hoangvu12 &lt;68330291+hoangvu12@users.noreply.github.com&gt;


[videojs]: http://videojs.com/
