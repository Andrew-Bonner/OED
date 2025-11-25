const { chai, mocha, expect, app, testDB } = require("../common");
const fs = require("fs");

const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const sharedBody = { message: "test" };
const sharedQuery = {
	logLimit: 10,
	timeInterval: "LAST_24_HOURS",
	logTypes: "info",
};
const raw = fs.readFileSync("src/server/test/routes/routes.json", "utf8");
const routeData = JSON.parse(raw);

mocha.describe("Testing User Routes", () => {
	mocha.describe("ADMIN TESTS", () => {
		let token;
		//admin user logs in
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
		//testing admin auth routes
		routeData.admin.GET.forEach((route) => {
			mocha.it(`Admin GET Route: ${route} - should allow admin`, async () => {
				const url = resolveParams(route);
				const req = chai
					.request(app)
					.get(url)
					.set("token", token)
					.query(sharedQuery);
				const res = await req.send(sharedBody);
				expect(res.status).to.be.oneOf([400, 202, 200]);
			});
		});

		routeData.admin.POST.forEach((route) => {
			mocha.it(`Admin POST Route: ${route} - should allow admin`, async () => {
				const url = resolveParams(route);
				const req = chai.request(app).post(url).set("token", token);
				const res = await req.send(sharedBody);
				expect(res.status).to.be.oneOf([200, 400, 202]);
			});
		});
		//testing optional auth routes
		routeData.Optional.GET.forEach((route) => {
			mocha.it(
				"Optional GET Route: " + route + " - should allow admin",
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200]);
				}
			);
		});
		//User route
		routeData.User.POST.forEach((route) => {
			mocha.it(
				"User POST Route: " + route + " - should allow admin",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//obvius routes
		routeData.Obvius.ALL.forEach((route) => {
			mocha.it(
				"Obvius ALL Route: " + route + " - should allow admin",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//Unauthenticated User Routes
		routeData.UnauthenticatedUser.GET.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow admin",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		routeData.UnauthenticatedUser.POST.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow admin",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
	});
	mocha.describe("EXPORT TESTS", () => {
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
			mocha.it(
				`Admin GET Route: ${route} - shouldnt allow export`,
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				}
			);
		});
		routeData.admin.POST.forEach((route) => {
			mocha.it(
				"Admin POST Route: " + route + " - shouldnt allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 403, 401]);
				}
			);
		});
		//testing optional auth routes
		routeData.Optional.GET.forEach((route) => {
			mocha.it(
				"Optional GET Route: " + route + " - should allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200]);
				}
			);
		});
		//User route
		routeData.User.POST.forEach((route) => {
			mocha.it(
				"User POST Route: " + route + " - should allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//obvius routes
		routeData.Obvius.ALL.forEach((route) => {
			mocha.it(
				"Obvius ALL Route: " + route + " - should allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//Unauthenticated User Routes
		routeData.UnauthenticatedUser.GET.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		routeData.UnauthenticatedUser.POST.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow export",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
	});
	mocha.describe("OBVIUS TESTS", () => {
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
			mocha.it(
				`Admin GET Route: ${route} - shouldnt allow obvius`,
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403, 400]);
				}
			);
		});

		routeData.admin.POST.forEach((route) => {
			mocha.it(
				`Admin POST Route: ${route} - shouldnt allow obvius`,
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 403, 401]);
				}
			);
		});
		//testing optional auth routes
		routeData.Optional.GET.forEach((route) => {
			mocha.it(
				"Optional GET Route: " + route + " - should allow obvius",
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200]);
				}
			);
		});
		//User route
		routeData.User.POST.forEach((route) => {
			mocha.it(
				"User POST Route: " + route + " - should allow obvius",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//obvius routes
		routeData.Obvius.ALL.forEach((route) => {
			mocha.it(
				"Obvius ALL Route: " + route + " - should allow obvius",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//Unauthenticated User Routes
		routeData.UnauthenticatedUser.GET.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow obvius",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		routeData.UnauthenticatedUser.POST.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow obvius",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
	});
	mocha.describe("CSV TESTS", () => {
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
			mocha.it(`Admin GET Route: ${route} - shouldnt allow csv`, async () => {
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
			mocha.it(`Admin POST Route: ${route} - shouldnt allow csv`, async () => {
				const url = resolveParams(route);
				const req = chai.request(app).post(url).set("token", token);
				const res = await req.send(sharedBody);
				expect(res.status).to.be.oneOf([400, 403, 401]);
			});
		});

		//testing optional auth routes
		routeData.Optional.GET.forEach((route) => {
			mocha.it(
				"Optional GET Route: " + route + " - should allow csv",
				async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set("token", token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200]);
				}
			);
		});
		//User route
		routeData.User.POST.forEach((route) => {
			mocha.it(
				"User POST Route: " + route + " - should allow csv",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//obvius routes
		routeData.Obvius.ALL.forEach((route) => {
			mocha.it(
				"Obvius ALL Route: " + route + " - should allow csv",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		//Unauthenticated User Routes
		routeData.UnauthenticatedUser.GET.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow csv",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
		routeData.UnauthenticatedUser.POST.forEach((route) => {
			mocha.it(
				"Unauthenticated User GET Route: " + route + " - should allow csv",
				async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set("token", token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				}
			);
		});
	});
});
//user object class
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
			undefined,
			"acsvuser",
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

function resolveParams(route) {
	return route.replace(/:([A-Za-z_]+)/g, "1");
}
