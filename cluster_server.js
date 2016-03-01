/**
 * Module dependencies.
 * A single instance of Node runs in a single thread. To take advantage of multi-core systems the user will sometimes want to launch a cluster of Node processes to handle the load. The cluster module allows you to easily create child processes that all share server ports.
 */

var
    os = require('os'),
    cluster = require('cluster');

/**
 * Cluster setup.
 */

// Setup the cluster to use app.js
cluster.setupMaster({
    exec: 'server-api-restify.js'
});

// Listen for dying workers
cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died');
    // Replace the dead worker
    cluster.fork();
});

// Fork a worker for each available CPU
for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}
