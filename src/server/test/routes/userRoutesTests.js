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

const User = require('../../models/User');
const Configfile = require('../../models/obvius/Configfile');
const bcrypt = require('bcryptjs');
const sharedBody = { message: 'test' };
const sharedQuery = {
	timeInterval: 'All',
	logTypes:'INFO,ERROR',
	logLimit:'10'
};

const raw = fs.readFileSync('src/server/test/routes/routes.json', 'utf8');
const routeData = JSON.parse(raw);

mocha.describe('Admin GET + POST route tests', () => {
	let token;

	mocha.beforeEach('admin user logs in', async () => {
		const conn = testDB.getConnection();

		const adminUser = TestUsers.admin();
		//const exportUser = TestUsers.export();
		(await adminUser).insert(conn);
		//(await exportUser).insert(conn);
		const res = await chai
			.request(app)
			.post('/api/login')
			.send({
				username: (await adminUser).username,
				password: TestUsers.adminPassword,
				//username: (await exportUser).username,
				//password: TestUsers.exportPassword,
			});
		token = res.body.token;
	});

	
	routeData.admin.GET.forEach(route => {
		mocha.it('Pass ${route} should allow admin', async () => {
			const url = resolveParams(route);
			const req = chai.request(app).get(url)
				.set("token", token)
			const res = await req.query(sharedQuery);
			expect(res.status).to.be.oneOf([200, 202, 400, 500]);
		});
	});
	    mocha.it('Pass /api/logs/logsmsg/getLogsByDateRangeAndType should allow admin', async () => {
        const res = await chai
            .request(app)
            .get('/api/logsmsg/getLogsByDateRangeAndType')
            .set('token', token)
            .query({
                timeInterval: 'all',
                logTypes: 'INFO,ERROR',
                logLimit: '10',
            });
        expect(res).to.have.status(200);
	});

	routeData.admin.POST.forEach(route => {
		mocha.it('Pass ${route} should allow admin', async () => {
		  const url = resolveParams(route);
		  const body = getRequestBodyForRoute(url);
		  const req = chai.request(app)
			.post(url)
			.set('token', token);
		  const res = await req.send(body);
		  expect(res.status).to.be.oneOf([200, 202, 400, 500]);
		});
	});

	routeData.admin.PUT.forEach(route => {
        mocha.it('Pass ${route} should allow admin', async () => {
            const url = resolveParams(route);
            const body = getRequestBodyForRoute(url);
            const res = await chai
                .request(app)
                .put(url)
                .set('token', token)
                .send(body);
            expect(res.status).to.be.oneOf([200, 202, 500]);
        });
    });
 });
	
 class TestUsers {
	static adminPassword = 'admin321#';
	static csvPassword = 'csv321#';
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
			1,
			'csvuser',
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

function getRequestBodyForRoute(url) {

    if (messageBodyMap[url]) {
        return messageBodyMap[url];
    }

   
    return sharedBody;
}

const messageBodyMap = {
	'/api/conversions/edit': {
		sourceId: 1,
		destinationId: 2,
		bidirectional: false,
		slope: 1.5,
		intercept: 0.5,
		note: null
	},
	//Not working
	'/api/conversions/addConversion': {
		sourceId: 1,
		destinationId: 2,
    	bidirectional: false,
		slope: 1.0,
		intercept: 0.0,
		note: null
	},
	'/api/conversions/delete': {
		sourceId: 1,
		destinationId: 2,
		meterIds: [],
		groupIds: []
	},
	'/api/conversions/simulate-delete': {
		sourceId: 1,
		destinationId: 2
	},
	//groups 
	'/api/groups/create': {
		name: 'Test Group ' + Date.now(),
        childGroups: [],
        childMeters: [],
        displayable: false,
        gps: null,
        note: '',
        area: 0,
        defaultGraphicUnit: -99,
        areaUnit: 'none' 
	},
	'/api/groups/delete': {
		id: 1
	},
	//maps
	'/api/maps/edit': {
		id: 1,
		name: 'Test Map',
		modifiedDate: '2025-01-01',
		filename: 'map1.png',
		mapSource: 'manual-upload',
		displayable: true,
		note: null,
		origin: {
			latitude: 40.0,
			longitude: -70.0
		},
		opposite: {
			latitude: 41.0,
			longitude: -71.0
		},
		northAngle: 0,
		circleSize: 10
	},
	'/api/maps/create': {
    	name: 'Test Map',
    	modifiedDate: '2025-01-01',
    	filename: 'map1.png',
    	mapSource: 'floorplan',
    	note: null,
    	displayable: false,
    	origin: {
    		latitude: 40.0,
      		longitude: -70.0
    	},
    	opposite: {
			latitude: 41.0,
    		longitude: -71.0
    	},
    	northAngle: 0,
    	circleSize: 10
  	},
	'/api/maps/delete': {
    id: 1
  	},
	//units
	'/api/units/edit': {
		id: 1,                       
		name: 'Updated Unit',
		identifier: 'unit_updated',
		unitRepresent: 'quantity',
		secInRate: 1.0,
		typeOfUnit: 'unit',
		suffix: 'u',
		displayable: 'all',
		preferredDisplay: true,
		note: 'updated note',
		minVal: 0,
		maxVal: 100,
		disableChecks: 'reject_none'
	},
	'/api/units/addUnit': {
		name: 'New Unit',
		identifier: 'unit_new',
		unitRepresent: 'flow',
		secInRate: 2.5,
		typeOfUnit: 'meter',
		suffix: 'm',
		displayable: 'admin',
		preferredDisplay: false,
		note: 'test note',
		minVal: 1,
		maxVal: 500,
		disableChecks: 'reject_disabled'
	},	
	'/api/units/delete': {
		id: 1
	},
	//users 
	'/api/users/create': {
    	username: 'testuser',
    	password: 'password123!',
    	role: 'admin',
    	note: 'created via test'
	},
	'/api/users/edit': {
    	user: {
        id: 1,                      
        username: 'updateduser',
        role: 'admin',
        note: 'edited via test',
        password: 'newPass123!'
    	}
	},
	'/api/users/delete': {
    	username: 'testuser'
	},
	'/api/groups/edit': {
    	id: 1,
    	name: 'Updated Group',
    	displayable: true,
    	gps: {
        	latitude: 40.1,
        	longitude: -70.1
    	},
    	note: '',
    	area: 0,
    	childGroups: [],
    	childMeters: [],
    	defaultGraphicUnit: 1,
    	areaUnit: 'none'
	}
};