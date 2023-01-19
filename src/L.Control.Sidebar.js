import * as L from 'leaflet';
const SideBar = {
  initSideBar: () => {
    L.Control.Sidebar = L.Control.extend({
      includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,

      options: {
        closeButton: true,
        position: 'left',
        autoPan: true
      },

      initialize(placeholder, options) {
        L.setOptions(this, options);

        // Find content container
        const content = (this._contentContainer = L.DomUtil.get(placeholder));

        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        const l = 'leaflet-';

        // Create sidebar container
        const container = (this._container = L.DomUtil.create(
          'div',
          l + 'sidebar ' + this.options.position
        ));

        // Style and attach content container
        L.DomUtil.addClass(content, l + 'control');
        container.appendChild(content);

        // Create close button and attach it if configured
        if (this.options.closeButton) {
          const close = (this._closeButton = L.DomUtil.create(
            'a',
            'close',
            container
          ));
          close.innerHTML = `
      <svg id="infoPanelCloseSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M16 17.4L5.5 27.8l-1.3-1.3L14.6 16 4.2 5.5l1.3-1.3L16 14.6 26.5 4.2l1.3 1.3L17.4 16l10.4 10.5-1.3 1.3"></path>
      </svg>
      `;
        }
      },

      addTo(map) {
        const container = this._container;
        const content = this._contentContainer;

        // Attach event to close button
        if (this.options.closeButton) {
          const close = this._closeButton;

          L.DomEvent.on(close, 'click', this.hide, this);
        }

        L.DomEvent.on(
          container,
          'transitionend',
          this._handleTransitionEvent,
          this
        ).on(container, 'webkitTransitionEnd', this._handleTransitionEvent, this);

        // Attach sidebar container to controls container
        const controlContainer = map._controlContainer;
        controlContainer.insertBefore(container, controlContainer.firstChild);

        this._map = map;

        // Make sure we don't drag the map when we interact with the content
        const stop = L.DomEvent.stopPropagation;
        const fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent.on(content, 'contextmenu', stop)
          .on(content, 'click', fakeStop)
          .on(content, 'mousedown', stop)
          .on(content, 'touchstart', stop)
          .on(content, 'dblclick', fakeStop)
          .on(content, 'mousewheel', stop)
          .on(content, 'MozMousePixelScroll', stop);

        return this;
      },

      removeFrom(map) {
        // if the control is visible, hide it before removing it.
        this.hide();

        const container = this._container;
        const content = this._contentContainer;

        // Remove sidebar container from controls container
        const controlContainer = map._controlContainer;
        controlContainer.removeChild(container);

        // disassociate the map object
        this._map = null;

        // Unregister events to prevent memory leak
        const stop = L.DomEvent.stopPropagation;
        const fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent.off(content, 'contextmenu', stop)
          .off(content, 'click', fakeStop)
          .off(content, 'mousedown', stop)
          .off(content, 'touchstart', stop)
          .off(content, 'dblclick', fakeStop)
          .off(content, 'mousewheel', stop)
          .off(content, 'MozMousePixelScroll', stop);

        L.DomEvent.off(
          container,
          'transitionend',
          this._handleTransitionEvent,
          this
        ).off(container, 'webkitTransitionEnd', this._handleTransitionEvent, this);

        if (this._closeButton && this._close) {
          const close = this._closeButton;

          L.DomEvent.off(close, 'click', this.hide, this);
        }

        return this;
      },

      isVisible() {
        return L.DomUtil.hasClass(this._container, 'visible');
      },

      show() {
        if (!this.isVisible()) {
          L.DomUtil.addClass(this._container, 'visible');
          if (this.options.autoPan) {
            this._map.panBy([-this.getOffset() / 2, 0], {
              duration: 0.5
            });
          }
          this.fire('show');
        }
      },

      hide(e) {
        if (this.isVisible()) {
          L.DomUtil.removeClass(this._container, 'visible');
          if (this.options.autoPan) {
            this._map.panBy([this.getOffset() / 2, 0], {
              duration: 0.5
            });
          }
          this.fire('hide');
        }
        if (e) {
          L.DomEvent.stopPropagation(e);
        }
      },

      toggle() {
        if (this.isVisible()) {
          this.hide();
        } else {
          this.show();
        }
      },

      getContainer() {
        return this._contentContainer;
      },

      getCloseButton() {
        return this._closeButton;
      },

      setContent(content) {
        const container = this.getContainer();

        if (typeof content === 'string') {
          container.innerHTML = content;
        } else {
          // clean current content
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

          container.appendChild(content);
        }

        return this;
      },

      getOffset() {
        if (this.options.position === 'right') {
          return -this._container.offsetWidth;
        } else {
          return this._container.offsetWidth;
        }
      },

      _handleTransitionEvent(e) {
        if (e.propertyName === 'left' || e.propertyName === 'right') {
          this.fire(this.isVisible() ? 'shown' : 'hidden');
        }
      }
    });

    L.control.sidebar = (placeholder, options) => {
      return new L.Control.Sidebar(placeholder, options);
    };
  }
};
export default SideBar;

