

/**
 * @constructor
 * @extends {events.EventEmitter}
 * @param {string} baseUrl
 */
net.Request = function(baseUrl) {
  events.EventEmitter.call(this);

  /**
   * @type {string}
   */
  this.__baseUrl = baseUrl;

	/**
	 * @type {!Array.<!Array.<net.RequestData>>}
	 */
	this.__sendQueue = [];

	/**
	 * @type {!Function}
	 */
	this.__run = utils.bind(this.__run, this);

	/**
	 * @type {number}
	 */
	this.__timeout = -1;

	/**
	 * @type {number}
	 */
	this.__ttr = net.Request.__DEFAULT_TTR;
};

utils.inherit(net.Request, events.EventEmitter);


/**
 * @type {number}
 */
net.Request.__DEFAULT_TTR = 30000;


/**
 * @return {string}
 */
net.Request.prototype.getBaseUrl = function() {
  return this.__baseUrl;
};


/**
 * @return {boolean}
 */
net.Request.prototype._isRunning = function() {
	return false;
};


/**
 * @param {net.RequestMethod} method
 * @param {string} path
 * @param {string=} opt_data
 */
net.Request.prototype._send = function(method, path, opt_data) {};


net.Request.prototype._reset = function() {};


net.Request.prototype.cancel = function() {
	this.__sendQueue.length = 0;
};


net.Request.prototype.abort = function() {
	if (this._isRunning()) {
		this._handleResult(0);
	}
};



/**
 * @param {net.RequestMethod} method
 * @param {string} path
 * @param {string=} opt_data
 */
net.Request.prototype.send = function(method, path, opt_data) {
	this.__sendQueue.push([method, path, opt_data]);
	utils.nextTick(this.__run);
};


/**
 * @param {number} status
 * @param {*=} opt_data
 */
net.Request.prototype._handleResult = function(status, opt_data) {
	utils.nextTick(this.__run);

	if (this.__timeout !== -1) {
		clearTimeout(this.__timeout);
		this.__timeout = -1;
	}

	this._reset();
  this.emit(new net.RequestEvent(this, net.RequestEvent.COMPLETE, status, opt_data), opt_data);
};


net.Request.prototype.__run = function() {
	if (!this._isRunning() && this.__sendQueue.length > 0) {
		var self = this;

		this.__timeout = setTimeout(function() {
			if (self._isRunning()) {
				self._handleResult(504);
			}
		}, this.__ttr);

		this._send.apply(this, this.__sendQueue.shift());
	}
};
