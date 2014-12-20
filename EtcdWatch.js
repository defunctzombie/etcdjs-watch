var debug = require('debug')('etcdjs-watch');
var EventEmitter = require('events').EventEmitter;

var Watcher = function(etcd, key, options) {
    if (!(this instanceof Watcher)) {
        return new Watcher(etcd, key, options);
    }

    debug('created watcher %s', key);
    var self = this;
    self._etcd = etcd;
    self._opt = options || {};
    self._key = key;

    self._stopped = true;
};

Watcher.prototype.__proto__ = EventEmitter.prototype;

Watcher.prototype.stop = function() {
    var self = this;
    debug('stopping %s', self._key);
    self._stopped = true;

    if (self._wait_stop) {
        self._wait_stop();
    }
};

Watcher.prototype.start = function() {
    var self = this;
    if (!self._stopped) {
        return;
    }

    debug('starting %s', self._key);
    self._stopped = false;
    self._wait();
};

Watcher.prototype._wait = function() {
    var self = this;

    if (self._stopped) {
        return;
    }

    debug('waiting %s', self._key);
    self._wait_stop = self._etcd.wait(self._key, self._opt, function(err, result) {
        if (err && err.code === 'ESOCKETTIMEDOUT') {
            return self._wait();
        }
        else if (err) {
            self.emit('error', err);
            setTimeout(function() {
                self._wait();
            }, 2000);
            return;
        }

        if (!result) {
            setTimeout(function() {
                self._wait();
            }, 1000);
            return;
        }

        debug('%s %s', result.action, result.node.key);
        self.emit(result.action, result);
        self._wait();
    });
};

module.exports = Watcher;
