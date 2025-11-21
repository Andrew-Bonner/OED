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
const sharedBody = { message: "test" };
const sharedQuery = {
	logLimit:10,
	timeInterval: "LAST_24_HOURS",
	logTypes:"info"
};

const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);

mocha.describe("Admin GET + POST route tests", () => {
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

	
	routeData.admin.GET.forEach(route => {
		mocha.it(`Pass ${route} should allow admin`, async () => {
			const url = resolveParams(route);
			const req = chai.request(app).get(url)
				.set("token", token)
				.query(sharedQuery);
			const res = await req.send(sharedBody);
			expect(res.status).to.be.oneOf([200, 202]);
		});
	});

	routeData.admin.POST.forEach(route => {
		mocha.it(`Pass ${route} should allow admin`, async () => {
			const url = resolveParams(route);
			const req = chai.request(app).post(url)
				.set("token", token);
			const res = await req.send(sharedBody);
			expect(res.status).to.be.oneOf([200, 202]);
		});
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

function resolveParams(route) {
    return route.replace(/:([A-Za-z_]+)/g, "1");
}



