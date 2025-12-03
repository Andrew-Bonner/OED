const { chai, mocha, expect, app, testDB } = require('../common');
const fs = require('fs');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const sharedBody = { message: 'test' };
const sharedQuery = {
	logLimit: 10,
	timeInterval: 'LAST_24_HOURS',
	logTypes: 'info',
};
const raw = fs.readFileSync('src/server/test/routes/routes.json', 'utf8');
const routeData = JSON.parse(raw);

/*This test is built to test the integrity of the standing auth middleware on routes along with the what
routes can each user access. The routes.json file holds all of the routes along with the different types
of authentication they have */

mocha.describe('Testing User Routes', () => {
	//First series of tests are for admin users against all of the routes in the routes.json
	mocha.describe('ADMIN USER', () => {
		//token value made outside of all test so it can be resued after being defined
		let token;
		//log in admin user and get token before each test
		mocha.beforeEach('admin user logs in', async () => {
			const conn = testDB.getConnection();
			const user = await TestUsers.admin();
			await user.insert(conn);
			const res = await chai.request(app).post('/api/login').send({
				username: user.username,
				password: TestUsers.adminPassword,
			});
			token = res.body.token;
		});
		//testing all of the admin auth routes against the admin user
		mocha.describe('Admin Auth Middleware GET + POST Routes', () => {
			//GET routes
			routeData.admin.GET.forEach((route) => {
				mocha.it(`GET ${route} - should allow admin`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					//status code 400,202,or 200 is considered a pass an a route was accessed
					expect(res.status).to.be.oneOf([400, 202, 200]);
				});
			});
			//POST routes
			routeData.admin.POST.forEach((route) => {
				mocha.it(`POST ${route} - should allow admin`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					//status code 400,202,or 200 is considered a pass an a route was accessed
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});

		//test all routes that have optional auth
		mocha.describe('Optional Auth GET Routes', () => {
			routeData.Optional.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow admin', async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200, 500]);
				});
			});
		});
		//test the login route
		mocha.describe('User POST Routes', () => {
			routeData.User.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow admin', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});
		//Test the obvius route
		mocha.describe('Obvius ALL Route', () => {
			routeData.Obvius.ALL.forEach((route) => {
				mocha.it('ALL' + route + ' - should allow admin', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([406, 400, 202]);
				});
			});
		});

		//This is for any routes that do not have any auth middleware
		mocha.describe('Unauthenticated User GET + POST Routes', () => {
			routeData.UnauthenticatedUser.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow admin', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).get(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});
	});

	mocha.describe('EXPORT USER', () => {
		let token;
		mocha.beforeEach('export user logs in', async () => {
			const conn = testDB.getConnection();
			const user = await TestUsers.export();
			await user.insert(conn);
			const res = await chai.request(app).post('/api/login').send({
				username: user.username,
				password: TestUsers.exportPassword,
			});
			token = res.body.token;
		});

		mocha.describe('Admin GET + POST Routes', () => {
			routeData.admin.GET.forEach((route) => {
				mocha.it(`GET ${route} - shouldnt allow export`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - shouldnt allow export', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([403, 401]);
				});
			});
		});

		mocha.describe('Optional Auth Routes', () => {
			routeData.Optional.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow export', async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200, 500]);
				});
			});
		});

		mocha.describe('User POST Routes', () => {
			routeData.User.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow export', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});

		mocha.describe(' Obvius ALL Route', () => {
			routeData.Obvius.ALL.forEach((route) => {
				mocha.it('ALL ' + route + ' - should allow export', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([406, 400, 202]);
				});
			});
		});

		mocha.describe('Unauthenticated User GET + Post Routes', () => {
			routeData.UnauthenticatedUser.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow export', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).get(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});

			routeData.UnauthenticatedUser.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow export', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});
	});

	mocha.describe('OBVIUS USER', () => {
		let token;
		mocha.beforeEach('obvius user logs in', async () => {
			const conn = testDB.getConnection();
			const user = await TestUsers.obvius();
			await user.insert(conn);
			const res = await chai.request(app).post('/api/login').send({
				username: user.username,
				password: TestUsers.obviusPassword,
			});
			token = res.body.token;
		});

		mocha.describe('Admin GET + POST Routes', () => {
			routeData.admin.GET.forEach((route) => {
				mocha.it(`GET ${route} - shouldnt allow obvius`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`POST ${route} - shouldnt allow obvius`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([403, 401]);
				});
			});
		});

		mocha.describe('Optional GET Routes', () => {
			routeData.Optional.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow obvius', async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200, 500]);
				});
			});
		});

		mocha.describe('User POST Routes', () => {
			routeData.User.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow obvius', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});

		mocha.describe('Obvius ALL Route', () => {
			routeData.Obvius.ALL.forEach((route) => {
				mocha.it('ALL ' + route + ' - should allow obvius', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([406, 400, 202]);
				});
			});
		});

		mocha.describe('Unauthenticated User GET + POST Routes', () => {
			routeData.UnauthenticatedUser.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow obvius', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).get(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});

			routeData.UnauthenticatedUser.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow obvius', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});
	});

	mocha.describe('CSV USER', () => {
		let token;
		mocha.beforeEach('csv user logs in', async () => {
			const conn = testDB.getConnection();
			const user = await TestUsers.csv();
			await user.insert(conn);
			const res = await chai.request(app).post('/api/login').send({
				username: user.username,
				password: TestUsers.csvPassword,
			});
			token = res.body.token;
		});

		mocha.describe('Admin GET + POST Routes', () => {
			routeData.admin.GET.forEach((route) => {
				mocha.it(`GET ${route} - shouldnt allow csv`, async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([401, 403]);
				});
			});

			routeData.admin.POST.forEach((route) => {
				mocha.it(`POST ${route} - shouldnt allow csv`, async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([403, 401]);
				});
			});
		});

		mocha.describe('Optional Auth GET Routes', () => {
			routeData.Optional.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow csv', async () => {
					const url = resolveParams(route);
					const req = chai
						.request(app)
						.get(url)
						.set('token', token)
						.query(sharedQuery);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([400, 202, 200, 500]);
				});
			});
		});

		mocha.describe('User POST Routes', () => {
			routeData.User.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow csv', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});

		mocha.describe('Obvius ALL Route', () => {
			routeData.Obvius.ALL.forEach((route) => {
				mocha.it('ALL ' + route + ' - should allow csv', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([406, 400, 202]);
				});
			});
		});

		mocha.describe('Unauthenticated User GET + POST Routes', () => {
			routeData.UnauthenticatedUser.GET.forEach((route) => {
				mocha.it('GET ' + route + ' - should allow csv', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).get(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});

			routeData.UnauthenticatedUser.POST.forEach((route) => {
				mocha.it('POST ' + route + ' - should allow csv', async () => {
					const url = resolveParams(route);
					const req = chai.request(app).post(url).set('token', token);
					const res = await req.send(sharedBody);
					expect(res.status).to.be.oneOf([200, 400, 202]);
				});
			});
		});
	});
});

class TestUsers {
	static adminPassword = 'admin321#';
	static csvPassword = 'csv4321#';
	static exportPassword = 'export32';
	static obviusPassword = 'obvius321#';

	static async admin() {
		return new User(
			undefined,
			'adminuser',
			await bcrypt.hash(this.adminPassword, 10),
			User.role.ADMIN
		);
	}

	static async csv() {
		return new User(
			undefined,
			'acsvuser',
			await bcrypt.hash(this.csvPassword, 10),
			User.role.CSV
		);
	}

	static async export() {
		return new User(
			undefined,
			'exportuser',
			await bcrypt.hash(this.exportPassword, 10),
			User.role.EXPORT
		);
	}

	static async obvius() {
		return new User(
			undefined,
			'obviususer',
			await bcrypt.hash(this.obviusPassword, 10),
			User.role.OBVIUS
		);
	}
}

function resolveParams(route) {
	return route.replace(/:([A-Za-z_]+)/g, '1');
}
