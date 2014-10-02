var assert = require('assert');
var path = require('path');

var Etcd = require('etcdjs');
var EtcdWatcher = require('../');

var etcd = Etcd();

test('should detect the key being set', function(done) {
    var watcher = EtcdWatcher(etcd, 'foo');

    watcher.on('set', function(result) {
        assert.equal('set', result.action);
        assert.equal('/foo', result.node.key);
        watcher.stop();
        done();
    });

    etcd.set('foo', 'bar');
});

test('should detect the key being updated', function(done) {
    var watcher = EtcdWatcher(etcd, 'foo');

    watcher.on('update', function(result) {
        assert.equal('update', result.action);
        assert.equal('/foo', result.node.key);
        watcher.stop();
        done();
    });

    etcd.set('foo', 'bar', { prevExist: true });
});

test('should stop waiting', function(done) {
    var watcher = EtcdWatcher(etcd, 'foo');

    watcher.on('update', function(result) {
        assert(false);
    });

    watcher.stop();
    etcd.set('foo', 'bar', { prevExist: true }, function() {
        done();
    });
});
