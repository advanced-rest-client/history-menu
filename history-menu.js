/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@polymer/paper-item/paper-item-body.js';
import '../../@polymer/paper-ripple/paper-ripple.js';
import '../../@polymer/paper-progress/paper-progress.js';
import '../../@polymer/iron-list/iron-list.js';
import '../../@api-components/http-method-label/http-method-label.js';
import {HistoryListMixin} from '../../@advanced-rest-client/history-list-mixin/history-list-mixin.js';
import {RequestsListMixin} from '../../@advanced-rest-client/requests-list-mixin/requests-list-mixin.js';
import '../../@advanced-rest-client/requests-list-mixin/requests-list-styles.js';
/**
 * A list of history requests in the ARC main menu.
 *
 * The element uses direct implementation of the PouchDB to make a query to the
 * datastore. It also listens to events fired by the `arc-model` elements to
 * update state of the history requests.
 *
 * ### Example
 * ```
 * <history-menu></history-menu>
 * ```
 *
 * ### Sizing the element
 *
 * The element uses `<iron-list>` to render the data in the view. The list is set
 * to be flex vertically. It means that the element has to be sized directly by the
 * hosting application or otherwise it size will be 0px.
 *
 * It can be done using flex layout and making the element to be `flex: 1`.
 *
 * ## Required dependencies
 *
 * The element works with `@advanced-rest-client/arc-models/request-model.js`
 * component. It should be included into the DOM.
 *
 * ### Styling
 * `<history-menu>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--history-menu-background-color` | Background color of the menu | `inherit`
 * `--history-menu-selected-post-method-color` | Font color of selected item POST method label | `#fff`
 * `--history-menu-focused-post-method-color` | Font color of focused item POST method label | `rgb(33, 150, 243)`
 * `--history-menu-selected-method-label-background-color` | Bg color of the POST method when focused | `#fff`
 * `--history-menu-selected-item-background-color` | Background color of the selected list item | `#FF9800`
 * `--history-menu-selected-item-color` | Color of the selected list item | `#fff`
 * `--history-menu-history-group-header-font-weigth` | Group header border color | `bold`
 * `--history-menu-history-group-header-border-color` | Group header border color | `#ddd`
 * `--history-menu-history-group-header-color` | Font color of the group header` | `rgba(0, 0, 0, 0.54)`
 * `--arc-menu-empty-info-color` | Color applied to the empty info section | ``
 * `--arc-menu-empty-info-title-color` | Color applied to the title in the empty info section | ``
 *
 * @polymer
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 * @appliesMixin RequestsListMixin
 * @appliesMixin HistoryListMixin
 */
class HistoryMenu extends HistoryListMixin(RequestsListMixin(PolymerElement)) {
  static get template() {
    return html`<style include="requests-list-styles">
    :host {
      display: block;
      background-color: var(--history-menu-background-color, inherit);
      position: relative;
      flex: 1;
      flex-basis: 0.000000001px;
      display: flex;
      flex-direction: column;
    }

    iron-list {
      flex: 1 1 auto;
    }

    .url {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
    }

    paper-progress {
      width: calc(100% - 32px);
      margin: 0 16px;
      position: absolute;
    }

    .empty-info {
      font-size: var(--arc-font-body1-font-size);
      font-weight: var(--arc-font-body1-font-weight);
      line-height: var(--arc-font-body1-line-height);
      font-style: italic;
      margin: 1em 16px;
      color: var(--arc-menu-empty-info-color);
    }

    .empty-title {
      white-space: var(--arc-font-nowrap-white-space);
      overflow: var(--arc-font-nowrap-overflow);
      text-overflow: var(--arc-font-nowrap-text-overflow);
      font-size: var(--arc-font-title-font-size);
      font-weight: var(--arc-font-title-font-weight);
      line-height: var(--arc-font-title-line-height);
      white-space: normal;
      color: var(--arc-menu-empty-info-title-color);
    }

    .empty-message {
      flex: 1;
      flex-basis: 0.000000001px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .empty-state-image {
      width: 180px;
      height: 120px;
    }

    [hidden] {
      display: none !important;
    }
    </style>
    <paper-progress hidden\$="[[!querying]]" indeterminate=""></paper-progress>
    <template is="dom-if" if="[[dataUnavailable]]">
      <div class="empty-message">
        <h3 class="empty-title">Send a request and recall it from here</h3>
        <p class="empty-info">Once you made a request it will appear in this place.</p>
      </div>
    </template>
    <iron-list items="[[requests]]" id="list" hidden\$="[[!hasRequests]]">
      <template>
        <div data-index\$="[[index]]" title\$="[[item.url]]" class\$="[[_computeItemClass(item._id, selectedItem)]]">
          <template is="dom-if" if="[[item.hasHeader]]">
            <div class="history-group-header">[[item.header]]</div>
          </template>
          <paper-icon-item
            on-click="_openHistory"
            class="request-list-item"
            draggable\$="[[_computeDraggableValue(draggableEnabled)]]"
            on-dragstart="_dragStart">
            <http-method-label method="[[item.method]]" slot="item-icon"></http-method-label>
            <paper-item-body two-line\$="[[_hasTwoLines]]">
              <div class="url">[[item.url]]</div>
              <div secondary="">[[item.timeLabel]]</div>
              <paper-ripple></paper-ripple>
            </paper-item-body>
          </paper-icon-item>
        </div>
      </template>
    </iron-list>`;
  }
  static get properties() {
    return {
      // Database ID of the selected item.
      selectedItem: String,
      /**
       * Adds draggable property to the request list item element.
       * The `dataTransfer` object has `arc/request-object` mime type with
       * serialized JSON with request model.
       */
      draggableEnabled: {type: Boolean, value: false}
    };
  }

  constructor() {
    super();
    this._scrollHandler = this._scrollHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.type = 'history';
    this.$.list.addEventListener('scroll', this._scrollHandler);
  }

  disconnectedCallback() {
    this.$.list.removeEventListener('scroll', this._scrollHandler);
    super.disconnectedCallback();
  }
  /**
   * Computes class name for the HTML element representing a history item.
   * @param {String} id
   * @param {String} selectedItem
   * @return {String}
   */
  _computeItemClass(id, selectedItem) {
    if (id && id === selectedItem) {
      return 'iron-selected';
    }
    return '';
  }
  /**
   * Called every time the element changed it's scroll position. It will call the `makeQuery`
   * function when there's less than 120px left to scroll. (also it must be opened and must not
   * already querying).
   */
  _scrollHandler() {
    if (this.querying) {
      return;
    }
    const elm = this.$.list;
    const delta = elm.scrollHeight - (elm.scrollTop + elm.offsetHeight);
    if (delta < 120) {
      this.loadNext();
    }
  }
  /**
   * Notifies the list that the resize event occurred.
   * Should be called whhen content of the list changed but the list wasn't
   * visible at the time.
   */
  notifyResize() {
    this.$.list.notifyResize();
  }
  /**
   * Handler for the `click` event on the item.
   * @param {ClickEvent} e
   */
  _openHistory(e) {
    const id = e.model.get('item._id');
    this._openRequest(id);
  }
  /**
   * Handler for the `dragstart` event added to the list item when `draggableEnabled`
   * is set to true.
   * This function sets request data on the `dataTransfer` object with `arc/request-object`
   * mime type. The request data is a serialized JSON with request model.
   * @param {Event} e
   */
  _dragStart(e) {
    if (!this.draggableEnabled) {
      return;
    }
    const request = e.model.get('item');
    const data = JSON.stringify(request);
    e.dataTransfer.setData('arc/request-object', data);
    e.dataTransfer.setData('arc/history-request', request._id);
    e.dataTransfer.setData('arc-source/history-menu', request._id);
    e.dataTransfer.effectAllowed = 'copy';
  }
  /**
   * Computes value for the `draggable` property of the list item.
   * When `draggableEnabled` is set it returns true which is one of the
   * conditions to enable drag and drop on an element.
   * @param {Boolean} draggableEnabled Current value of `draggableEnabled`
   * @return {String} `true` or `false` (as string) depending on the argument.
   */
  _computeDraggableValue(draggableEnabled) {
    return draggableEnabled ? 'true' : 'false';
  }
}
window.customElements.define('history-menu', HistoryMenu);
