# etcdjs-watch

Watch etcd keys for changes. Requires [etcdjs](https://github.com/mafintosh/etcdjs) for the backend.

```js
var ectd = require('etcdjs');
var EtcdWatch = require('etcdjs-watch');

var etcd = Etcd();

var watcher = EtcdWatch(etcd, '/some/key', { options });

watcher.on('set', function(result) {
});

watcher.on('update', function(result) {
});

watcher.on('delete', function(result) {
});

watcher.stop();
```
