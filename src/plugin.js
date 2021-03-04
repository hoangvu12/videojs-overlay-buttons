import videojs from "video.js";
import { version as VERSION } from "../package.json";

let latestTap;
let isLocked = false;
// Default options for the plugin.
const defaults = {
  seekLeft: {
    handleClick: (player) => {
      const time = Number(player.currentTime()) - 10;

      player.currentTime(time);
    },
    doubleTap: true,
  },
  play: {
    handleClick: (player) => {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    },
  },
  seekRight: {
    handleClick: (player) => {
      const time = Number(player.currentTime()) + 10;

      player.currentTime(time);
    },
    doubleTap: true,
  },
  lockButton: false,
};

const controlButtons = {
  previous: { icon: "backward", className: "previous-button" },
  seekLeft: { icon: "history", className: "seek-left" },
  play: { icon: "play", className: "play-button" },
  seekRight: {
    icon: "history",
    className: "seek-right",
    extra: "fa-flip-horizontal",
  },
  next: {
    icon: "forward",
    className: "next-button",
  },
};

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

  const overlay = createOverlay(player, options);

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

const createOverlay = (player, options) => {
  if (!options || !Object.keys(options).length) {
    options = { ...defaults };
  } else {
    options = mergeOptions(options, defaults);
  }

  const overlay_div = document.createElement("div");
  const controlOverlay = document.createElement("div");

  controlOverlay.className = "control-overlay-buttons";

  overlay_div.className = "vjs-overlay";

  const btnOpts = Object.keys(options).filter((button) =>
    controlButtons.hasOwnProperty(button)
  );

  const buttons = btnOpts.map((button) => {
    const buttonProperties = controlButtons[button];

    const element = createButton(buttonProperties);

    return { options: options[button], element };
  });

  handleClick(buttons, player);
  handleTap(buttons, player);

  if (options.lockButton) {
    const lockButtonProperties = {
      icon: "lock",
      className: "lock-button",
      size: "2x",
    };

    const lockButton = createButton(lockButtonProperties);

    handleLockClick(lockButton);

    controlOverlay.append(lockButton);
  }

  buttons.forEach((button) => controlOverlay.append(button.element));

  overlay_div.append(controlOverlay);

  return overlay_div;
};

const handleLockClick = (lockBtn) => {
  const [wrapperElement] = lockBtn.children;

  wrapperElement.addEventListener("click", () => {
    const controlButtonsWrapper = Array.from(
      document.querySelectorAll(".overlay-button:not(.lock-button)")
    );

    if (isLocked) {
      wrapperElement.innerHTML = '<i class="icon fa fa-2x fa-lock"></i>';
      controlButtonsWrapper.forEach((btn) => {
        btn.style.display = "";
      });
      isLocked = false;
      return;
    }

    wrapperElement.innerHTML = '<i class="icon fa fa-2x fa-unlock"></i>';
    controlButtonsWrapper.forEach((btn) => {
      btn.style.display = "none";
    });
    isLocked = true;
  });
};

const handleTap = (buttons, player) => {
  buttons = buttons.filter(
    (button) => button.options.doubleTap && button.options.handleClick
  );

  buttons.forEach((button) => {
    button.element.addEventListener("click", () => {
      isDoubleTap(() => {
        button.options.handleClick(player);
      });
    });
  });
};

const handleClick = (buttons, player) => {
  buttons = buttons.filter((btn) => btn.options.handleClick);

  buttons.forEach((button) => {
    const [wrapperElement] = button.element.children;

    wrapperElement.addEventListener("click", () =>
      button.options.handleClick(player)
    );
  });
};

const createButton = ({ icon, extra = "", className = "", size = "4x" }) => {
  const iconEl = document.createElement("i");
  iconEl.className = `icon fa fa-${size} fa-${icon} ${extra}`;

  const wrapper = document.createElement("div");
  wrapper.className = "button-wrapper";
  wrapper.append(iconEl);

  const button = document.createElement("div");
  button.className = `overlay-button vjs-button ${className}`;

  button.append(wrapper);

  return button;
};

const isDoubleTap = (callback) => {
  const now = new Date().getTime();
  const timeSince = now - latestTap;

  if (timeSince < 400 && timeSince > 0) {
    callback();
  }

  latestTap = new Date().getTime();
};

const mergeOptions = (originalOpts, defaultOpts) => {
  for (let key in originalOpts) {
    const userOption = originalOpts[key];
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

  return originalOpts;
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
  // videojs.mergeOptions(defaults, options)
  this.ready(() => {
    onPlayerReady(this, options);
  });
};

// Register the plugin with video.js.
registerPlugin("touchOverlay", touchOverlay);

// Include the version number.
touchOverlay.VERSION = VERSION;

export default touchOverlay;
