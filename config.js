module.exports = [
	{
		"name": "State of Charge",
		"topics": [
			{
				"name": "soc",
				"topic": "power/battery/charge"
			}
		],
		"mqttBroker": "mqtt://ninjasphere.local",
		"vendorId": 0,
		"deviceId": 520,
		"data": function(topic) {
			return(0+topic.soc);
		},
		"interval": 60
	},
	{
		"name": "Charge Rate",
		"topics": [
			{
				"name": "power",
				"topic": "power/flow/power"
			},
			{
				"name": "status",
				"topic": "power/flow/status"
			}
		],
		"mqttBroker": "mqtt://ninjasphere.local",
		"vendorId": 0,
		"deviceId": 243,
		"data": function(topic) {
			if (topic.status == "discharge") {
				if (topic.power > 0) {
					topic.power = -topic.power;
				}
			}
			return(topic.power * 1000);
		},
		"interval": 10
	}
];