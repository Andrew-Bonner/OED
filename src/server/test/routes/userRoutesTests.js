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
const { param } = require("../../app");

const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);

mocha.describe("different user types trying several", () => {
	//create users
	//next loop through each route in the json file based on the current format as of 11/18
	//for (const authType in routeData) {
	//const methods = routeData[authType];
	//for (const method in methods) {
	//const routeList = methods[method];
	//for (const route of routeList) {
	//try adminuser against the first route (splitting routes up first)
	//for (let i = 0; i > 3; i++) {
	mocha.it("logging in", async () => {
		const adminPassword = "admin321#";
		const conn = testDB.getConnection();
		const admin = new User(
			undefined,
			"adminuser",
			await bcrypt.hash(adminPassword, 10),
			User.role.ADMIN
		);
		await admin.insert(conn);
		const res = await chai.request(app).post("/api/login").send({
			username: admin.username,
			password: adminPassword,
		});
		const token = res.body.token;
		const res2 = await chai
			.request(app)
			.post("/api/conversion-array/refresh")
			.set("token", token);
		expect(res2).to.have.status(200);
	});
	//}

	//}
	//}
	//}
});
class TestUsers {
	static admin;

	static async createUsers() {
		this.admin = new User(
			undefined,
			"adminuser",
			await bcrypt.hash("admin321#", 10),
			User.role.ADMIN
		);
	}
}
