'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    pathOr = _require.pathOr;

var State = function State() {
  var _this = this;

  _classCallCheck(this, State);

  Object.defineProperty(this, 'pubSubCount', {
    enumerable: true,
    writable: true,
    value: function value() {
      var publishers = _this.publishers,
          subscribers = _this.subscribers;
      /* eslint-disable no-param-reassign */

      var pubs = Object.keys(publishers).reduce(function (acc, source) {
        acc[source] = Object.keys(publishers[source]).length;
        acc.total += acc[source];
        return acc;
      }, { camera: 0, screen: 0, custom: 0, total: 0 });

      var subs = Object.keys(subscribers).reduce(function (acc, source) {
        acc[source] = Object.keys(subscribers[source]).length;
        acc.total += acc[source];
        return acc;
      }, { camera: 0, screen: 0, sip: 0, custom: 0, total: 0 });
      /* eslint-enable no-param-reassign */
      return { publisher: pubs, subscriber: subs };
    }
  });
  Object.defineProperty(this, 'getPubSub', {
    enumerable: true,
    writable: true,
    value: function value() {
      var publishers = _this.publishers,
          subscribers = _this.subscribers,
          pubSubCount = _this.pubSubCount;

      return { publishers: publishers, subscribers: subscribers, meta: pubSubCount() };
    }
  });
  Object.defineProperty(this, 'all', {
    enumerable: true,
    writable: true,
    value: function value() {
      var streams = _this.streams,
          streamMap = _this.streamMap,
          getPubSub = _this.getPubSub;

      return Object.assign({}, { streams: streams, streamMap: streamMap }, getPubSub());
    }
  });
  Object.defineProperty(this, 'getSession', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.session;
    }
  });
  Object.defineProperty(this, 'setSession', {
    enumerable: true,
    writable: true,
    value: function value(otSession) {
      _this.session = otSession;
    }
  });
  Object.defineProperty(this, 'getCredentials', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.credentials;
    }
  });
  Object.defineProperty(this, 'setCredentials', {
    enumerable: true,
    writable: true,
    value: function value(otCredentials) {
      _this.credentials = otCredentials;
    }
  });
  Object.defineProperty(this, 'getOptions', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.options;
    }
  });
  Object.defineProperty(this, 'setOptions', {
    enumerable: true,
    writable: true,
    value: function value(otOptions) {
      _this.options = otOptions;
    }
  });
  Object.defineProperty(this, 'addStream', {
    enumerable: true,
    writable: true,
    value: function value(stream) {
      _this.streams[stream.id] = stream;
    }
  });
  Object.defineProperty(this, 'removeStream', {
    enumerable: true,
    writable: true,
    value: function value(stream) {
      var streamMap = _this.streamMap,
          subscribers = _this.subscribers,
          streams = _this.streams;

      var type = pathOr('sip', 'videoType', stream);
      var subscriberId = streamMap[stream.id];
      delete streamMap[stream.id];
      delete subscribers[type][subscriberId];
      delete streams[stream.id];
    }
  });
  Object.defineProperty(this, 'getStreams', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.streams;
    }
  });
  Object.defineProperty(this, 'getStreamMap', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.streamMap;
    }
  });
  Object.defineProperty(this, 'addPublisher', {
    enumerable: true,
    writable: true,
    value: function value(type, publisher) {
      _this.streamMap[publisher.streamId] = publisher.id;
      _this.publishers[type][publisher.id] = publisher;
    }
  });
  Object.defineProperty(this, 'removePublisher', {
    enumerable: true,
    writable: true,
    value: function value(type, publisher) {
      var streamMap = _this.streamMap,
          publishers = _this.publishers;

      var id = publisher.id || streamMap[publisher.streamId];
      if (id == null) {
        throw 'Publisher no longer exists. It may have been previously destroyed.';
      }
      delete publishers[type][id];
      delete streamMap[publisher.streamId];
    }
  });
  Object.defineProperty(this, 'removeAllPublishers', {
    enumerable: true,
    writable: true,
    value: function value() {
      var publishers = _this.publishers,
          removePublisher = _this.removePublisher;

      ['camera', 'screen', 'custom'].forEach(function (type) {
        Object.values(publishers[type]).forEach(function (publisher) {
          removePublisher(type, publisher);
        });
      });
    }
  });
  Object.defineProperty(this, 'addSubscriber', {
    enumerable: true,
    writable: true,
    value: function value(subscriber) {
      var subscribers = _this.subscribers,
          streamMap = _this.streamMap;

      var streamId = subscriber.stream.id;
      var type = pathOr('sip', 'stream.videoType', subscriber);
      subscribers[type][subscriber.id] = subscriber;
      streamMap[streamId] = subscriber.id;
    }
  });
  Object.defineProperty(this, 'removeSubscriber', {
    enumerable: true,
    writable: true,
    value: function value(type, subscriber) {
      var subscribers = _this.subscribers,
          streamMap = _this.streamMap;

      var id = subscriber.id || streamMap[subscriber.streamId];
      if (id == null) {
        throw 'Subscriber no longer exists. It may have been previously destroyed.';
      }
      delete subscribers[type][id];
      delete streamMap[subscriber.streamId];
    }
  });
  Object.defineProperty(this, 'removeAllSubscribers', {
    enumerable: true,
    writable: true,
    value: function value() {
      ['camera', 'screen', 'sip', 'custom'].forEach(function (type) {
        Object.values(_this.subscribers[type]).forEach(function (subscriber) {
          _this.removeSubscriber(type, subscriber);
        });
      });
    }
  });
  Object.defineProperty(this, 'reset', {
    enumerable: true,
    writable: true,
    value: function value() {
      var removeAllPublishers = _this.removeAllPublishers,
          removeAllSubscribers = _this.removeAllSubscribers,
          streams = _this.streams,
          streamMap = _this.streamMap;

      removeAllPublishers();
      removeAllSubscribers();
      [streams, streamMap].forEach(function (streamObj) {
        Object.keys(streamObj).forEach(function (streamId) {
          delete streamObj[streamId]; // eslint-disable-line no-param-reassign
        });
      });
    }
  });

  this.publishers = {
    camera: {},
    screen: {},
    custom: {}
  };

  // Map subscriber id to subscriber objects
  this.subscribers = {
    camera: {},
    screen: {},
    sip: {},
    custom: {}
  };

  // Map stream ids to stream objects
  this.streams = {};

  // Map stream ids to subscriber/publisher ids
  this.streamMap = {};

  // The OpenTok session
  this.session = null;

  // OpenTok session credentials
  this.credentials = null;

  // Core options
  this.options = null;
}
/**
* Internal methods
*/

/**
* Returns the count of current publishers and subscribers by type
 * @returns {Object}
 *    {
 *      publishers: {
 *        camera: 1,
 *        screen: 1,
 *        custom: 0,
 *        total: 2
 *      },
 *      subscribers: {
 *        camera: 3,
 *        screen: 1,
 *        custom: 0,
 *        total: 4
 *      }
 *   }
 */


/**
 * Returns the current publishers and subscribers, along with a count of each
 * @returns {Object}
 */


/**
 * Get streams, streamMap, publishers, and subscribers
 * @return {Object}
 */


/**
 * Get the current OpenTok session
 * @returns {Object}
 */


/**
 * Set the current OpenTok session
 * @param {Object} otSession
 */


/**
 * Get the current OpenTok credentials
 * @returns {Object}
 */


/**
 * Set the current OpenTok credentials
 * @param {Object} otCredentials
 */


/**
 * Get the options defined for core
 * @returns {Object}
 */


/**
 * Set the options defined for core
 * @param {Object} otOptions
 */


/**
 * Add a stream to state
 * @param {Object} stream - An OpenTok stream object
 */


/**
 * Remove a stream from state and any associated subscribers
 * @param {Object} stream - An OpenTok stream object
 */


/**
 * Get all remote streams
 * @returns {Object}
 */


/**
 * Get the map of stream ids to publisher/subscriber ids
 * @returns {Object}
 */


/**
 * Add a publisher to state
 * @param {String} type - 'camera' or 'screen'
 * @param {Object} publisher - The OpenTok publisher object
 */


/**
 * Remove a publisher from state
 * @param {String} type - 'camera' or 'screen'
 * @param {Object} publisher - The OpenTok publisher object
 */


/**
 * Remove all publishers from state
 */


/**
 * Add a subscriber to state
 * @param {Object} - An OpenTok subscriber object
 */


/**
 * Remove a publisher from state
 * @param {String} type - 'camera' or 'screen'
 * @param {Object} subscriber - The OpenTok subscriber object
 */


/**
 * Remove all subscribers from state
 */


/**
 * Reset state
 */
;

/** Export */


exports.default = State;