# videojs-overlay-buttons

Touch overlay for player

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Installation

```sh
npm install --save videojs-overlay-buttons
```

## Options

### Default options

```js
{
  seekLeft: {
    handleClick: () => {
      const time = Number(player.currentTime()) - 10;

      player.currentTime(time);
    },
  },
  play: {
    handleClick: () => {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    },
  },
  seekRight: {
    handleClick: () => {
      const time = Number(player.currentTime()) + 10;

      player.currentTime(time);
    },
  },
}
```

### Available options

```js
{
  previous: {},
  seekLeft: {},
  play: {},
  seekRight: {},
  next: {}
}
```

## Includes Font Awesome

Any version will works.

```html
<link rel="stylesheet" href="//path/to/font-awesome/5.15.2/css/all.min.css" />
```

## Usage

To include videojs-overlay-buttons on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-overlay-buttons.min.js"></script>
<script>
  var player = videojs("my-video");

  player.touchOverlay(options);
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-overlay-buttons via npm and `require` the plugin as you would any other module.

```js
var videojs = require("video.js");

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require("videojs-overlay-buttons");

var player = videojs("my-video");

player.touchOverlay(options);
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(["video.js", "videojs-overlay-buttons"], function (videojs) {
  var player = videojs("my-video");

  player.touchOverlay(options);
});
```

## License

MIT. Copyright (c) hoangvu12 &lt;68330291+hoangvu12@users.noreply.github.com&gt;

[videojs]: http://videojs.com/
