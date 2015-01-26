

/**
 * @constructor
 * @param {string} method
 * @param {string} url
 * @param {*=} opt_data
 */
net.Request = function(method, url, opt_data) {
  /**
   * @type {string}
   */
  this.__method = method;

  /**
   * @type {string}
   */
  this.__url = url;

  /**
   * @type {*}
   */
  this.__data = opt_data || null;
};


/**
 * @return {string}
 */
net.Request.prototype.getMethod = function() {
  return this.__method;
};


/**
 * @return {string}
 */
net.Request.prototype.getUrl = function() {
  return this.__url;
};


/**
 * @return {*}
 */
net.Request.prototype.getData = function() {
  return this.__data;
};
