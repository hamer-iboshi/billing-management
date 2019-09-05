const chai = require('chai');
const chaiHttp = require('chai-http');
const Contract = require('../src/controllers/ContractController');
const server = require('../src/server');
const should = chai.should();

chai.use(chaiHttp);

describe('Test contract operations', () => {
    
    it('should get all contracts', (done) =>{
        chai.request(server)
            .get('/')
            .end((err, res) => {
                should.exist(res.body);
                res.should.have.status(200);
                res.should.be.a('object');
                done();
            });
    })
});

after( async (done) => {
    done()
});