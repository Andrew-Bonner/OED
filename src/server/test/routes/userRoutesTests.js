const {
	chai,
	mocha,
	expect,
	app,
	testDB,
	testUser,
	recreateDB,
	// SHL: OED requires single quotes. If you have your VSC setup as recommended it would show.
} = require("../common");
const fs = require("fs");
// Read file and parse JSON

// Access elements as strings
// "21"

const User = require("../../models/User");
const Configfile = require("../../models/obvius/Configfile");
const bcrypt = require("bcryptjs");
const { dropConnection } = require("../../db.js");
// SHL: A number of the imports seem not to be used.
// SHL: 1) Why create a new opject when User.role exists in src/server/models/User.js. I thought I had suggested that in the end during our call.
// 2) I'm not yet clear on how you will test a non-logged in user (no role).
//make a user to log in with
// SHL: "test routes" seems vague. I would include what you are testing.
let newUser;
mocha.describe("roles other than admin accessing admin routes", () => {
	// SHL: I thought you were going to loop over all the roles and try them one at a time.
	// SHL: This creates a User instance but does not seem to ever create the user in the DB for login.
	for (const role in User.role) {
		if (User.role[role] !== User.role.ADMIN) {
			mocha.it(
				"${role} cannot access route due to lack of permissions",
				async () => {
					const conn = testDB.getConnection(); //start db
					newUser = new User(
						undefined,
						"${role}@example.com",
						bcrypt.hash("password", 10),
						User.role[role]
					); //creates user
					await newUser.insert(conn); //adds user to db
					let res = await chai
						.request(app)
						.post("/api/conversion-array/refresh")
						.send({ username: newUser.username, password: newUser.password });
					expect(res).to.have.status(403);
				}
			);
		}
	}
});
mocha.after(() => {
	dropConnection();
});

// SHL: If you change the user password before putting into DB then this will not work. I thought I had mentioned that it might be best
// to user the value from User.role as the username and generate the password as the value + '_password' so it has the role name in the
// passsword. Doing this via a function to standardize would be  best. This means each role has a unique password.
// SHL: See above about looping over roles. I think the macha description string can include the current role. I did not think it would
// be necessary to separate the types of roles.

//come up with mechanism to log in with role you want

// SHL: The chai request is the same in both cases. I would make the request, set the expected value with an if/else and then
// check the status based on the value set in a variable in the if/else (since same in both cases).

// SHL: Since newRes is scoped to this test, I think it is clearer to just use res as a locally scoped variable.
// Also, I think this and other values should be const not let.

// SHL: It might be good to have this in the JSON name/format you are going to use. It does not have to happen now
// but I think that will be needed to loop over all the routes.

// SHL: I know OED does not tend ot use "globally" declared values for the codes but it should. See HTTP_CODE in src/server/util/readingsUtils.js
// where you can add a new one for 401.
