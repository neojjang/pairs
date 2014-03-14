(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Desktop;

module.exports = Desktop = (function() {
  function Desktop() {
    var Encryption, Socket, overlayEl;
    Socket = require('./socket');
    Encryption = require('./encryption');
    this.socket = new Socket;
    this.encryption = new Encryption;
    this.rootUrl = 'http://192.168.0.11:9000';
    if (location.hostname === 'pairs.io') {
      this.rootUrl = 'http://pairs.io';
    }
    this.connectionKey = this.initKey('connectionCode');
    this.encryptionKey = this.initKey('encryptionKey');
    this.visualKey = '';
    this.qrCode = new QRCode(document.getElementById("qr-code"), {
      text: 'pairs.io',
      width: 300,
      height: 300
    });
    $.supersized({
      slides: [
        {
          image: '../images/remotes_bg_min.png'
        }
      ]
    });
    $('#visual-code a').on('click', (function(_this) {
      return function() {
        _this.generateVisualKey();
        _this.generateQrCode();
        return false;
      };
    })(this));
    this.socket.io.on('desktop:paired', (function(_this) {
      return function() {
        return _this.onPaired();
      };
    })(this));
    this.socket.io.on('desktop:command', (function(_this) {
      return function(data) {
        var event, selector;
        selector = _this.encryption.decryptAes(data.selector, _this.encryptionKey);
        event = _this.encryption.decryptAes(data.event, _this.encryptionKey);
        return $(selector).trigger(event);
      };
    })(this));
    $('#phone-wrapper').css('margin-top', $(window).height());
    overlayEl = $('#overlay');
    overlayEl.fadeOut(1200);
    $('#button-dim').click(function() {
      var spanEl;
      spanEl = $(this).children('span');
      if (overlayEl.css('display') === 'none') {
        overlayEl.fadeIn('slow');
        spanEl.text('On');
        spanEl.addClass('dim-on');
        spanEl.removeClass('dim-off');
      } else {
        overlayEl.fadeOut('slow');
        spanEl.text('Off');
        spanEl.addClass('dim-off');
        spanEl.removeClass('dim-on');
      }
      return false;
    });
    this.generateVisualKey();
    this.generateQrCode();
    this.connectToServer();
  }

  Desktop.prototype.initKey = function(keyName) {
    var key;
    key = localStorage.getItem(keyName);
    if (!key) {
      key = this.encryption.randString();
      localStorage.setItem(keyName, key);
    }
    return key;
  };

  Desktop.prototype.connectToServer = function() {
    return this.socket.io.emit('desktop:connect', {
      connectionKey: this.connectionKey
    });
  };

  Desktop.prototype.generateVisualKey = function() {
    this.visualKey = this.encryption.randString(5);
    return $('#visual-code span').text(this.visualKey);
  };

  Desktop.prototype.generateQrCode = function() {
    var data, enc, json;
    json = JSON.stringify({
      ck: this.connectionKey,
      ek: this.encryptionKey
    });
    enc = this.encryption.encryptAes(json, this.visualKey);
    data = "" + this.rootUrl + "/remote.html#" + enc;
    this.qrCode.clear();
    return this.qrCode.makeCode(data);
  };

  Desktop.prototype.onPaired = function() {
    $('.logo').addClass('paired');
    $('#right-wrapper').animate({
      top: "-" + ($('#phone-wrapper').offset().top - 10) + "px"
    }, 'fast');
    return $('#subscribe-wide').fadeOut('slow');
  };

  return Desktop;

})();


},{"./encryption":2,"./socket":5}],2:[function(require,module,exports){
var Encryption;

module.exports = Encryption = (function() {
  function Encryption() {}

  Encryption.prototype.randString = function(length) {
    if (length == null) {
      length = 16;
    }
    return Math.random().toString(36).substr(2, length);
  };

  Encryption.prototype.encryptAes = function(data, key) {
    return GibberishAES.enc(data, key);
  };

  Encryption.prototype.decryptAes = function(data, key) {
    return GibberishAES.dec(data, key);
  };

  return Encryption;

})();


},{}],3:[function(require,module,exports){
jQuery(function() {
  var Desktop, Enc, Remote, enc;
  if ($('#isRemote').length) {
    Remote = require('./remote');
    new Remote;
  } else {
    Desktop = require('./desktop');
    new Desktop;
  }
  Enc = require('./encryption');
  return enc = new Enc;
});


},{"./desktop":1,"./encryption":2,"./remote":4}],4:[function(require,module,exports){
var Encryption, Remote, Socket;

Socket = require('./socket');

Encryption = require('./encryption');

module.exports = Remote = (function() {
  function Remote() {
    var self;
    this.socket = new Socket;
    this.encryption = new Encryption;
    this.socket.io.on('remote:paired', (function(_this) {
      return function() {
        return _this.onPaired();
      };
    })(this));
    this.encHashData = location.hash.split('#').join('');
    $('#visual-code').on('submit', (function(_this) {
      return function(e) {
        var key;
        key = $('#visual-code-input').val();
        e.preventDefault();
        false;
        return _this.encodeAndConnect(key);
      };
    })(this));
    $('#visual-code-input').focus();
    self = this;
    $('#button-dim').click(function() {
      var spanEl;
      spanEl = $(this).children('span');
      if (spanEl.text() === 'Off') {
        spanEl.text('On');
        spanEl.addClass('dim-on');
        spanEl.removeClass('dim-off');
      } else {
        spanEl.text('Off');
        spanEl.addClass('dim-off');
        spanEl.removeClass('dim-on');
      }
      self.sendCommand({
        command: 'dim',
        event: 'click',
        selector: '#button-dim'
      });
      return false;
    });
    this.onPaired();
  }

  Remote.prototype.connectToServer = function() {
    return this.socket.io.emit('remote:connect', {
      connectionKey: this.connectionKey
    });
  };

  Remote.prototype.sendCommand = function(data) {
    var command, event, selector;
    command = this.encryption.encryptAes(data.command, this.encryptionKey);
    event = this.encryption.encryptAes(data.event, this.encryptionKey);
    selector = this.encryption.encryptAes(data.selector, this.encryptionKey);
    return this.socket.io.emit('remote:command', {
      command: command,
      event: event,
      selector: selector,
      connectionKey: this.connectionKey
    });
  };

  Remote.prototype.encodeAndConnect = function(key) {
    var decData, e, good, obj;
    good = false;
    try {
      decData = this.encryption.decryptAes(this.encHashData, key);
      obj = JSON.parse(decData);
      this.connectionKey = obj.ck;
      this.encryptionKey = obj.ek;
      good = true;
    } catch (_error) {
      e = _error;
      null !== null;
    }
    if (good) {
      return this.connectToServer();
    }
  };

  Remote.prototype.onPaired = function() {
    $('.logo').addClass('paired');
    return $('body').addClass('isPaired');
  };

  return Remote;

})();


},{"./encryption":2,"./socket":5}],5:[function(require,module,exports){
var Socket;

module.exports = Socket = (function() {
  Socket.prototype.socketUrl = 'http://192.168.0.11:12222';

  function Socket() {
    if (location.hostname === 'pairs.io') {
      this.socketUrl = 'http://pairs.io:12222';
    }
    this.io = io.connect(this.socketUrl);
  }

  return Socket;

})();


},{}]},{},[3])