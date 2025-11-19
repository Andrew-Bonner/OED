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

const User = require("../../models/User");
const Configfile = require("../../models/obvius/Configfile");
const bcrypt = require("bcryptjs");

const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);

mocha.describe("different user types trying several", () => {
	let users;
	//create users
	mocha.before("create users and insert them into the database", async () => {
		const conn = testDB.getConnection();
		users = [
			new User(
				undefined,
				"adminuser",
				await bcrypt.hash("admin321#", 10),
				User.role.ADMIN
			),
			new User(
				undefined,
				"obviususer",
				await bcrypt.hash("obvius321#", 10),
				User.role.OBVIUS
			),
			new User(
				undefined,
				"csvuser",
				await bcrypt.hash("csv321#", 10),
				User.role.CSV
			),
			new User(
				undefined,
				"exportuser",
				await bcrypt.hash("export321#", 10),
				User.role.EXPORT
			),
		];
		//insert users into the database
	});
	//next loop through each route in the json file based on the current format as of 11/18
	//for (const authType in routeData) {
	//const methods = routeData[authType];
	//for (const method in methods) {
	//const routeList = methods[method];
	//for (const route of routeList) {
	//try adminuser against the first route (splitting routes up first)

	//for (let i = 0; i > 3; i++) {
	mocha.it("logging in", async () => {
		let res = await chai.request(app).post("/api/login").send({
			username: testUser.username,
			password: testUser.password,
		});
		token = res.body.token;
		let res2 = await chai
			.request(app)
			.post("/api/conversions/addConversion")
			.set("token", token);
		expect(res2).to.have.status(400);
	});
	//}

	//}
	//}
	//}
});
