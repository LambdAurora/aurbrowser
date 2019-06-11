/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of lambdastyle.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

LambdaStyle = {};
LambdaStyle.internal = {};
LambdaStyle.utils = {};

// Activation events registered on the root element of each instance for activation.
const LS_POINTER_ACTIVATION_EVENT_TYPES = ['touchstart', 'mousedown', 'keydown'];
// Deactivation events registered on documentElement when a pointer-related down event occurs.
const LS_POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'mouseup', 'contextmenu'];

LambdaStyle.init = () => {
  console.log(' -- LambdaStyle -- Initializing...');
  LambdaStyle.init_ripples();
};

LambdaStyle.enable_auto_referesh = () => {
  console.log(' -- LambdaStyle -- Enabled auto refresh.');
  LambdaStyle.internal.mut_observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      LambdaStyle.update_ripples();
    });
  });
  LambdaStyle.internal.mut_observer.observe(document.querySelector('body'), { childList: true, subtree: true, attributes: true });
};

LambdaStyle.init_ripples = () => {
  LambdaStyle.internal.ripples = LambdaStyle.utils.to_array(document.querySelectorAll('.ls-ripple-effect, .ls-btn:not([disabled])')).map(elem => new LSRipple(elem));
};

LambdaStyle.update_ripples = () => {
  let ripples_current = LambdaStyle.internal.ripples.map(ripple => ripple.elem);
  let ripples_updated = LambdaStyle.utils.to_array(document.querySelectorAll('.ls-ripple-effect, .ls-btn:not([disabled])'));
  ripples_updated = ripples_updated.filter(elem => !ripples_current.includes(elem)).map(elem => new LSRipple(elem));
  ripples_updated.forEach(ripple => LambdaStyle.internal.ripples.push(ripple));
  return ripples_updated.length;
};

/*
 * Internal
 */

class LSElement {
  constructor(dom) {
    this.elem = dom;
  }

  add_class(name) {
    this.elem.classList.add(name);
  }

  remove_class(name) {
    this.elem.classList.remove(name);
  }

  update_css_var(name, value) {
    this.elem.style.setProperty(name, value);
  }

  is_disabled() {
    return this.elem.hasAttribute('disabled');
  }
}

LambdaStyle.internal.ripples = [];

const __LS_RIPPLE_FG_ACTIVATION__ = 'ls-ripple-effect-activation';
const __LS_RIPPLE_FG_DEACTIVATION__ = 'ls-ripple-effect-deactivation';

class LSRipple extends LSElement {
  constructor(element) {
    super(element);

    this.activation_state = this.default_activation_state();

    this.init();
  }

  init() {
    this.elem.classList.add('ls-ripple-effect-handler');
    this.update();

    LS_POINTER_ACTIVATION_EVENT_TYPES.forEach(n => this.elem.addEventListener(n, e => this.activate(e)));
    LS_POINTER_DEACTIVATION_EVENT_TYPES.forEach(n => this.elem.addEventListener(n, e => this.deactivate()));

    window.addEventListener('resize', _ => {
      this.update();
    });
  }

  update() {
    this.size = this.elem.getBoundingClientRect();
    this.max_radius = Math.max(this.size.height, this.size.width);
    this.initial_size = Math.floor(this.max_radius * 0.6);
    this.fg_scale = this.max_radius / this.initial_size;
    this.update_css();
  }

  update_css() {
    this.update_css_var('--ls-ripple-fg-size', `${this.initial_size}px`);
    this.update_css_var('--ls-ripple-fg-scale', this.fg_scale);
  }

  activate(e) {
    if (this.is_disabled())
      return;
    if (this.activation_state.is_activated)
      return;

    this.activation_state.is_activated = true;
    this.activation_state.is_programmatic = e === undefined;
    this.activation_state.activation_event = e;
    this.activation_state.was_activated_by_pointer = this.activation_state.is_programmatic ? false : e !== undefined && (e.type == 'mousedown' || e.type == 'touchstart' || e.type === 'pointerdown');
    this.animate_activation();
  }

  deactivate() {
    this.animate_deactivation();
    this.reset_activation_state();
  }

  default_activation_state() {
    return {
      is_activated: false,
      was_activated_by_pointer: false,
      activation_event: undefined,
      is_programmatic: false
    };
  }

  reset_activation_state() {
    this.activation_state = this.default_activation_state();
  }

  animate_activation() {
    const {start_point, end_point} = this.get_fg_translation_coords();
    let translate_start = `${start_point.x}px, ${start_point.y}px`;
    let translate_end = `${end_point.x}px, ${end_point.y}px`;

    this.update_css_var('--ls-ripple-fg-translate-start', translate_start);
    this.update_css_var('--ls-ripple-fg-translate-end', translate_end);
    this.remove_class(__LS_RIPPLE_FG_ACTIVATION__);
    this.remove_class(__LS_RIPPLE_FG_DEACTIVATION__);

    this.add_class(__LS_RIPPLE_FG_ACTIVATION__);
  }

  animate_deactivation() {
    this.remove_class(__LS_RIPPLE_FG_ACTIVATION__);
    this.add_class(__LS_RIPPLE_FG_DEACTIVATION__);

    setTimeout(_ => {
      this.remove_class(__LS_RIPPLE_FG_DEACTIVATION__);
    }, 150);
  }

  get_fg_translation_coords() {
    const {activation_event, was_activated_by_pointer} = this.activation_state;

    let start_point = { x: this.size.width / 2, y: this.size.height / 2 };

    if (was_activated_by_pointer) {
      start_point = LambdaStyle.utils.get_normalized_event_coords(activation_event, { x: window.pageXOffset, y: window.pageYOffset }, this.elem.getBoundingClientRect());
    }

    // Center the element around the start point.
    start_point = {
      x: start_point.x - (this.initial_size / 2),
      y: start_point.y - (this.initial_size / 2),
    };

    const end_point = {
      x: (this.size.width / 2) - (this.initial_size / 2),
      y: (this.size.height / 2) - (this.initial_size / 2)
    };

    return {start_point, end_point};
  }
};

/*
 * Utils
 */

LambdaStyle.utils.get_normalized_event_coords = (e, page_offset, client_rect) => {
  const {x, y} = page_offset;
  const doc_x = x + client_rect.left;
  const doc_y = y + client_rect.top;

  let normalized_x;
  let normalized_y;

  if (e.type === 'touchstart') {
    normalized_x = e.changedTouches[0].page_x - doc_x;
    normalized_y = e.changedTouches[0].page_y - doc_y;
  } else {
    normalized_x = e.pageX - doc_x;
    normalized_y = e.pageY - doc_y;
  }

  return { x: normalized_x, y: normalized_y };
};

LambdaStyle.utils.to_array = (obj) => {
  let array = [];
  // Iterate backwards ensuring that length is an UInt32.
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
};
