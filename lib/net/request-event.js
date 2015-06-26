

/**
 * @constructor
 * @extends {events.Event}
 * @param {!events.IEventEmitter} target
 * @param {string} type
 * @param {number} responseStatus
 * @param {string=} opt_data
 */
net.RequestEvent = function(target, type, responseStatus, opt_data) {
	events.Event.call(this, target, type);

	/**
	 * @type {number}
	 */
	this.__responseStatus = responseStatus;

	/**
	 * @type {string}
	 */
	this.__data = opt_data || '';
};

utils.inherit(net.RequestEvent, events.Event);


/**
 * @type {string}
 */
net.RequestEvent.COMPLETE = 'complete';


/**
 * @return {string} Данные ответа.
 */
net.RequestEvent.prototype.getResponseData = function() {
	return this.__data;
};


/**
 * @return {number} HTTP-статус ответа.
 */
net.RequestEvent.prototype.getResponseStatus = function() {
	return this.__responseStatus;
};


/**
 * @return {boolean}
 */
net.RequestEvent.prototype.isRequestFailed = function() {
	return this.__responseStatus >= 400 || this.__responseStatus === 0;
};


/**
 * @return {boolean}
 */
net.RequestEvent.prototype.isRequestFailLocal = function() {
	return this.__responseStatus === 0;
};


/**
 * @return {boolean}
 */
net.RequestEvent.prototype.isRequestTimeout = function() {
	return this.__responseStatus === 504 || this.__responseStatus === 408;
};


/**
 * @return {boolean}
 */
net.RequestEvent.prototype.isRequestForbidden = function() {
	return this.__responseStatus === 403;
};
