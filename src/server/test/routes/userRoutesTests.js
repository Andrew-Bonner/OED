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
	let token;
	mocha.beforeEach("admin user logs in", async () => {
		const conn = testDB.getConnection();

		const adminUser = TestUsers.admin();
		(await adminUser).insert(conn);
		const res = await chai
			.request(app)
			.post("/api/login")
			.send({
				username: (await adminUser).username,
				password: TestUsers.adminPassword,
			});
		token = res.body.token;
	});
	mocha.it("conversion-array refresh", async () => {
		const res2 = await chai
			.request(app)
			.post("/api/conversion-array/refresh")
			.set("token", token);
		expect(res2).to.have.status(200);
	});
});
class TestUsers {
	static adminPassword = "admin321#";
	static async admin() {
		return new User(
			undefined,
			"adminuser",
			await bcrypt.hash(this.adminPassword, 10),
			User.role.ADMIN
		);
	}
}
