/**
 * @file plugin.js
 */

import videojs from 'video.js';
import mpegtsjs from 'mpegts.js';

const Html5 = videojs.getTech('Html5');
const mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;
const defaults = {
  mediaDataSource: {},
  config: {}
};

class Mpegtsjs extends Html5 {

  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Mpegtsjs` Tech is ready.
   */
   constructor(options, ready) {
     options = mergeOptions(defaults, options);
     super(options, ready);
   }

   /**
    * A getter/setter for the `Mpegtsjs` Tech's source object.
    *
    * @param {Tech~SourceObject} [src]
    *        The source object you want to set on the `Mpegtsjs` techs.
    *
    * @return {Tech~SourceObject|undefined}
    *         - The current source object when a source is not passed in.
    *         - undefined when setting
    */
  src(src) {
    if (this.mpegtsPlayer) {
      // Is this necessary to change source?
      this.mpegtsPlayer.detachMediaElement();
      this.mpegtsPlayer.destroy();
    }

    const mediaDataSource = this.options_.mediaDataSource;
    const config = this.options_.config;

    mediaDataSource.type = mediaDataSource.type === undefined ? 'flv' : mediaDataSource.type;
    mediaDataSource.url = src;
    delete mediaDataSource.segments;

    this.mpegtsPlayer = mpegtsjs.createPlayer(mediaDataSource, config);
    this.mpegtsPlayer.attachMediaElement(this.el_);
    this.mpegtsPlayer.load();
  }

  /**
   * Dispose of mpegtsjs.
   */
  dispose() {
    if (this.mpegtsPlayer) {
      this.mpegtsPlayer.detachMediaElement();
      this.mpegtsPlayer.destroy();
    }
    super.dispose();
  }

}

/**
 * Check if the Mpegtsjs tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Mpegtsjs tech is supported.
 *          - False otherwise.
 */
Mpegtsjs.isSupported = function() {

  return mpegtsjs && mpegtsjs.isSupported();
};

/**
 * Mpegtsjs supported mime types.
 *
 * @constant {Object}
 */
Mpegtsjs.formats = {
  'video/flv': 'FLV',
  'video/x-flv': 'FLV'
};

/**
 * Check if the tech can support the given type
 *
 * @param {string} type
 *        The mimetype to check
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Mpegtsjs.canPlayType = function(type) {
  if (Mpegtsjs.isSupported() && type in Mpegtsjs.formats) {
    return 'maybe';
  }

  return '';
};

/**
 * Check if the tech can support the given source
 * @param {Object} srcObj
 *        The source object
 * @param {Object} options
 *        The options passed to the tech
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Mpegtsjs.canPlaySource = function(srcObj, options) {
  return Mpegtsjs.canPlayType(srcObj.type);
};

// Include the version number.
Mpegtsjs.VERSION = '__VERSION__';

videojs.registerTech('mpegtsjs', Mpegtsjs);

export default Mpegtsjs;
