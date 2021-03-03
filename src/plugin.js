import videojs from "video.js";
import { version as VERSION } from "../package.json";

let latestTap;

// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass("vjs-touch-overlay");

  const overlay = createOverlay(options, player);

  eventsInitialize(player, overlay);

  player.el().append(overlay);
};

const eventsInitialize = (player, overlay) => {
  player.on("play", () => {
    const playButtonWrapper = document.querySelector(
      ".play-button .button-wrapper"
    );

    playButtonWrapper.innerHTML = '<i class="icon fa fa-4x fa-pause"></i>';
  });

  player.on("pause", () => {
    const playButtonWrapper = document.querySelector(
      ".play-button .button-wrapper"
    );

    playButtonWrapper.innerHTML = '<i class="icon fa fa-4x fa-play"></i>';
  });

  player.on("userinactive", () => {
    overlay.classList.add("overlay-hide");
  });

  player.on("useractive", () => {
    overlay.classList.remove("overlay-hide");
  });
};

const createOverlay = (options, player) => {
  const defaultOpts = {
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
  };

  if (!options || !Object.keys(options).length) {
    options = { ...defaultOpts };
  }

  for (let key in options) {
    const userOption = options[key];
    const defaultOption = defaultOpts[key];

    if (!defaultOption) continue;

    for (let option in defaultOption) {
      if (
        !userOption.hasOwnProperty(option) &&
        defaultOption.hasOwnProperty(option)
      ) {
        userOption[option] = defaultOption[option];
      }
    }
  }

  const initButtons = {
    previous: createPreviousButton,
    seekLeft: createSeekLeft,
    play: createPlayButton,
    seekRight: createSeekRight,
    next: createNextButton,
  };

  const overlay_div = document.createElement("div");

  const btnOpts = Object.keys(options);

  const buttons = btnOpts.map((button) => {
    return { options: options[button], element: initButtons[button]() };
  });

  handleClick(buttons);
  handleTap(buttons);

  overlay_div.className = "vjs-overlay";

  buttons.forEach((button) => overlay_div.append(button.element));

  return overlay_div;
};

const handleTap = (buttons) => {
  buttons = buttons.filter(
    (button) => button.options.doubleTap && button.options.handleClick
  );

  buttons.forEach((button) => {
    button.element.addEventListener("click", () =>
      isDoubleTap(button.options.handleClick)
    );
  });
};

const handleClick = (buttons) => {
  buttons.forEach((button) => {
    const [wrapperElement] = button.element.children;

    wrapperElement.addEventListener("click", button.options.handleClick);
  });
};

const createPreviousButton = () => {
  const previousButton = createButton("backward");
  previousButton.classList.add("previous-button");

  return previousButton;
};

const createPlayButton = () => {
  const playButton = createButton("play");
  playButton.classList.add("play-button");

  return playButton;
};

const createNextButton = () => {
  const nextButton = createButton("forward");
  nextButton.classList.add("next-button");

  return nextButton;
};

const createSeekLeft = () => {
  const seekLeft = createButton("history");
  seekLeft.classList.add("seek-left");

  return seekLeft;
};

const createSeekRight = () => {
  const seekLeft = createButton("history", "fa-flip-horizontal");
  seekLeft.classList.add("seek-right");

  return seekLeft;
};

const createButton = (iconClass, extra = "") => {
  const icon = document.createElement("i");
  icon.className = `icon fa fa-4x fa-${iconClass} ${extra}`;

  const wrapper = document.createElement("div");
  wrapper.className = "button-wrapper";
  wrapper.append(icon);

  const button = document.createElement("div");
  button.className = "overlay-button vjs-button";

  button.append(wrapper);

  return button;
};

const isDoubleTap = (callback) => {
  const now = new Date().getTime();
  const timeSince = now - latestTap;

  if (timeSince < 600 && timeSince > 0) {
    callback();
  }

  latestTap = new Date().getTime();
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function touchOverlay
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const touchOverlay = function (options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin("touchOverlay", touchOverlay);

// Include the version number.
touchOverlay.VERSION = VERSION;

export default touchOverlay;