var util = require('util'),
	stream = require('stream'),
	Device = require('./device'),
	config = require('./config');

// Give our driver a stream interface
util.inherits(Driver, stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the Ninja Platform
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the Ninja Platform
 */
function Driver(opts, app) {

	this._app = app;
	app.on('client::up',function() {
		// The client is now connected to the Ninja Platform
		config.forEach(this.createDevice.bind(this));
 	}.bind(this));
};

Driver.prototype.createDevice = function(cfg) {
	var device = new Device(this._app, cfg);
	this.emit('register', device);
};

// Export it
module.exports = Driver;