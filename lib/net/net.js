

/**
 * @namespace
 */
var net = {};


/**
 * @return {XMLHttpRequest|ActiveXObject}
 */
net.createXHRRequest = function() {
  if (typeof window['XMLHttpRequest'] !== 'undefined') {
    return new XMLHttpRequest();
  }

  if (typeof window['ActiveXObject'] !== 'undefined') {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }

  return null;
};


/**
 * @param {string} method
 * @param {string} url
 * @param {*=} opt_data
 * @return {fm.RegularAction}
 */
net.send = function(method, url, opt_data) {
  /**
   * @param {fm.CompleteHandler} complete
   * @param {fm.CancelHandler} cancel
   * @param {fm.Input} input
   */
  function send(complete, cancel, input) {
    var request = net.createXHRRequest();

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          complete(request.responseText);
        } else {
          cancel('[net.send] url = ' + url+ ', status = ' + request.status);
        }
        reset();
      }
    };

    request.onerror = function(error) {
      cancel('[net.send] url  = ' + url + ', error = ' + error);
      reset();
    };

    function reset() {
      request.onreadystatechange = null;
      request.onerror = null;
      request = null;
    }

    request.open(method, url, true);
    request.send(opt_data || null);
  }

  return send;
};
