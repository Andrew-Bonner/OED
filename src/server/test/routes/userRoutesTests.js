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
const { token } = require("morgan");

const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);
const users = [
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

mocha.describe("roles other than admin accessing admin routes", () => {
	let token;
	let res;
	//next loop through each route in the json file based on the current format as of 11/18
	for (const authType in routesData) {
		const methods = routesData[authType];
		for (const method in methods) {
			const routeList = methods[method];
			for (const route of routeList) {
				//try adminuser against the first route (splitting routes up first)
				mocha.describe("Putting admin user against " + route, async () => {
					const adminUser = users[0];
					//admin logs in
					mocha.before("admin login", async () => {
						const conn = testDB.getConnection();
						await adminUser.insert(conn);
						let res = await chai.request(app).post("/api/login").send({
							username: adminUser.username,
							password: adminUser.password,
						});
						token = res.body.token;
					});
					//admin tried route
					mocha.it("admin tries " + route, async () => {
						let res = await chai
							.request(app)
							.post("/api/conversions/addConversion")
							.set("token", token);
						expect(res).to.have.status(200);
					});
				});
			}
		}
	}
});
