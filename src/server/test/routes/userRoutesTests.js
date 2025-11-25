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
<<<<<<< HEAD
const sharedBody = { message: "test" };
const sharedQuery = {
	logLimit: 10,
	timeInterval: "LAST_24_HOURS",
	logTypes: "info",
};
=======
>>>>>>> parent of 97504d50 (Start iterating through get and post routes)

const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);

<<<<<<< HEAD
mocha.describe("Admin GET + POST route tests", () => {
	const roles = ["ADMIN", "CSV", "EXPORT", "OBVIUS"];
	for (let i = 0; i < roles.length; i++) {
		if (roles[i] === "ADMIN") {
			let token;
			mocha.beforeEach("admin user logs in", async () => {
				const conn = testDB.getConnection();
				const user = TestUsers.admin();
				(await user).insert(conn);
				const res = await chai
					.request(app)
					.post("/api/login")
					.send({
						username: (await user).username,
						password: TestUsers.adminPassword,
					});
				token = res.body.token;
			});
			routeData.admin.GET.forEach((route) => {
				mocha.beforeEach(`Pass ${route} should allow admin`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 202, 400]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`Pass ${route} should allow admin`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 202, 400]);
				});
			});
		} else if (roles[i] === "CSV") {
			let token;
			mocha.beforeEach("csv user logs in", async () => {
				const conn = testDB.getConnection();
				const user = TestUsers.csv();
				(await user).insert(conn);
				const res = await chai
					.request(app)
					.post("/api/login")
					.send({
						username: (await user).username,
						password: TestUsers.csvPassword,
					});
				token = res.body.token;
			});
			routeData.admin.GET.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow csv`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow csv`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});
		} else if (roles[i] === "EXPORT") {
			let token;
			mocha.beforeEach("export user logs in", async () => {
				const conn = testDB.getConnection();
				const user = TestUsers.export();
				(await user).insert(conn);
				const res = await chai
					.request(app)
					.post("/api/login")
					.send({
						username: (await user).username,
						password: TestUsers.exportPassword,
					});
				token = res.body.token;
			});
			routeData.admin.GET.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow export`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow export`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});
		} else {
			let token;
			mocha.beforeEach("obvius user logs in", async () => {
				const conn = testDB.getConnection();
				const user = TestUsers.obvius();
				(await user).insert(conn);
				const res = await chai
					.request(app)
					.post("/api/login")
					.send({
						username: (await user).username,
						password: TestUsers.obviusPassword,
					});
				token = res.body.token;
			});
			routeData.admin.GET.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow obvius`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`Pass ${route} shouldnt allow obvius`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				});
			});
		}
	}
});

=======
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
>>>>>>> parent of 97504d50 (Start iterating through get and post routes)
class TestUsers {
	static adminPassword = "admin321#";
	static csvPassword = "csv321#";
	static exportPassword = "export32";
	static obviusPassword = "obvius321#";

	static async admin() {
		return new User(
			undefined,
			"adminuser",
			await bcrypt.hash(this.adminPassword, 10),
			User.role.ADMIN
		);
	}

	static async csv() {
		return new User(
			1,
			"csvuser",
			await bcrypt.hash(this.csvPassword, 10),
			User.role.CSV
		);
	}

	static async export() {
		return new User(
			undefined,
			"exportuser",
			await bcrypt.hash(this.exportPassword, 10),
			User.role.EXPORT
		);
	}

	static async obvius() {
		return new User(
			undefined,
			"obviususer",
			await bcrypt.hash(this.obviusPassword, 10),
			User.role.OBVIUS
		);
	}
}
<<<<<<< HEAD

function resolveParams(route) {
	return route.replace(/:([A-Za-z_]+)/g, "1");
}
=======
>>>>>>> parent of 97504d50 (Start iterating through get and post routes)
