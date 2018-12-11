var chai = require('chai');
var assert = chai.assert;
var nock = require('nock');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const BASE_URL = 'http://locahost:3009';
const LOCATIONS_API = '/api/locations';

describe('LocationControllerTest', () => {

    beforeEach(() => {
        nock(BASE_URL).get(LOCATIONS_API).reply(200, [{id: 1}, {id: 2}]);
    });

    it('Initial', () => {
        assert.equal(4, 4);
    });
    
    it('Should fetch all locations', function(done){
        chai.request(BASE_URL).get(LOCATIONS_API).end(function(err, response) {
            assert.propertyVal(response, 'statusCode', 200);
            assert.lengthOf(JSON.parse(response.text), 2);
            done();
          });
    });
});