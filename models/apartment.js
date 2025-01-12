const mongoose = require("mongoose");

var apartmentSchema = mongoose.Schema({
	name: String,
	place: {
		bedrooms: Number,
		beds: Number,
		bathrooms: Number,
		room_type: String,	// private room, shared room, apartment
		living_room: { type: String, default: 'False'},
		floor: String,
		area: Number
	},

	description: String,
	renting_rules: {
		smoking: { type: String, default: 'False'},
		pets: { type: String, default: 'False'},
		events: { type: String, default: 'False'},
		rent_days_min: Number
	},
