# videojs-overlay-buttons

Touch overlay for player

![How overlay looks like](https://i.ibb.co/RPWYdy5/image.png)

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
    doubleTap: true,
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
    doubleTap: true,
  },
  lockButton: false
}
```

| Options     | Type     | Description                                                                      |
| ----------- | -------- | -------------------------------------------------------------------------------- |
| handleClick | Function | This Function will be executed when the button is clicked                        |
| doubleTap   | Boolean  | If the holder of the icon is double tapped, execute handleClick option           |
| lockButton  | Boolean  | Show lock button when true, will hide all buttons except lockButton when clicked |

### Lock button

_When lockButton is true_

![When lockButton: true](https://i.ibb.co/DQ41S8s/image.png)

_When lock button is clicked_

![Lock button is clicked](https://i.ibb.co/ch2qBTC/image.png)

This will hide all buttons (also control bar) except lock button

### Available buttons

```js
{
  previous: {},
  seekLeft: {},
  play: {},
  seekRight: {},
  next: {}
}
```

## CDN

### CSS

Add this to your `head` tag

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/videojs-overlay-buttons@latest/dist/videojs-overlay-buttons.css"
/>
```

### JS

Add this to bottom your `body` tag

```html
<script src="https://unpkg.com/videojs-overlay-buttons@latest/dist/videojs-overlay-buttons.min.js"></script>
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
