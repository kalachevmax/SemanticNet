

/**
 * @constructor
 * @extends {net.Request}
 * @param {string} baseUrl
 * @param {boolean=} opt_useCors
 */
net.XhrRequest = function(baseUrl, opt_useCors) {
	net.Request.call(this, baseUrl);

	/**
	 * @type {XMLHttpRequest}
	 */
	this.__request = null;

	/**
	 * @type {boolean}
	 */
	this.__useCors = opt_useCors || false;
};

utils.inherit(net.XhrRequest, net.Request);


/**
 * @return {XMLHttpRequest}
 */
net.XhrRequest.prototype.__createNativeRequest = function() {
	if (window['XMLHttpRequest'] !== undefined) {
		return new XMLHttpRequest();
	}

	if (window['ActiveXObject'] !== undefined) {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}

	return null;
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._reset = function() {
 	if (this.__request !== null) {
		this.__request.onreadystatechange = utils.nop;
		this.__request.abort();
		this.__request = null;
	}
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._isRunning = function() {
	return this.__request !== null;
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._send = function(method, path, opt_data) {
	this.__request = this.__createNativeRequest();

	if (this.__request !== null) {
		var self = this;

		this.__request.onreadystatechange = function() {
			if (self.__request !== null && self.__request.readyState === 4) {
				var data = self.__request.responseText || '';
				var status = self.__request.status;

				if (status === 1223) {
					status = 204;
				}

				self._handleResult(status, data);
			}
		};

		var url = this.getBaseUrl() + path;
		var data = opt_data || '';

		if (method === net.RequestMethod.GET && data.length > 0) {
			url += (url.indexOf('?') === -1 ? '?' : '&') + data;
		}

		this.__request.open(method, url, true);
		this.__request.withCredentials = this.__useCors;

		var dataToSend = null;

		if (method !== net.RequestMethod.GET) {
			this.__request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			dataToSend = data;
		} else {
			this.__request.setRequestHeader('Content-Type', 'text/plain');
		}

		try {
			this.__request.send(dataToSend);
		} catch (error) {
			console.log('XHR request error: ' + error.message);
			this._handleResult(500);
		}
	} else {
		console.log('Unable to create instance of XMLHttpRequest');
		this._handleResult(500);
	}
};
