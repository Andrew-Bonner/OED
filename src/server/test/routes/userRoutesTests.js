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
		let res = await chai.request(app).post("/api/login").send({
			username: testUser.username,
			password: testUser.password,
		});
		expect(res).to.have.status(200);
	});
	//}

	//}
	//}
	//}
});
class TestUsers {
	constructor() {
		this.users = {};
	}

	static async addConnection(conn) {
		await this.createUsers(
			"ADMIN",
			"adminuser",
			"admin321#",
			User.role.ADMIN,
			conn
		);
	}

	async createUsers(key, username, password, role, connection) {
		const hash = await bcrypt.hash(password, 10);
		const user = new User(undefined, username, hash, role);
		await user.insert(conn);
		this.users[key] = user;
		return user;
	}
	static get(key) {
		return this.users[key];
	}
}
