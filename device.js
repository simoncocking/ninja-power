var stream = require('stream'),
	util = require('util'),
	mqtt = require('mqtt');

util.inherits(Device, stream);

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the Ninja Platform
 *
 * @fires data - Emit this when you wish to send data to the Ninja Platform
 */
function Device(app, config) {

	var self = this;
	this._app = app;

	this._app.log.info('ninja-power: initialising ' + config.name);

	// This device will emit data
	this.readable = true;
	// This device cannot be actuated
	this.writeable = false;

	this.G = "0"; // G is a string a represents the channel
	this.V = config.vendorId;
	this.D = config.deviceId;
	this.name = config.name;
	this._data = {};
	this._topicMap = {};

	this._app.log.info('ninja-power: connecting to MQTT');
	var client = mqtt.connect(config.mqttBroker, {
		protocolId: 'MQIsdp',
		protocolVersion: 3
	});
	client.on('connect', function() {
		config.topics.forEach(function(topic) {
			self._topicMap[topic.topic] = topic.name;
			self._app.log.info('ninja-power: subscribing to '
				+ config.mqttBroker
				+ '/'
				+ topic.topic
			);
			client.subscribe(topic.topic);
		});
	});
	client.on('message', function(topic, message) {
		// self._app.log.info('ninja-power: Received MQTT data on topic '+topic+': '+message);
		self._data[self._topicMap[topic]] = message;
	});

	setInterval(function() {
		var data = config.data(self._data);
		// self._app.log.info('ninja-power: emitting '+data);
		self.emit('data', data);
	}, config.interval * 1000);
}

// Export it
module.exports = Device;
