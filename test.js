const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect =chai.expect;
const server = require('./server.js');
const { AssertionError } = require('chai');

chai.use(chaiHttp);

let id;
suite('Functional Tests', () => {
    suite('Routing Tests /api/exercise', () => {
        suite('POST ', () => {
            test('Test POST /api/exercise/new-user with new user update', (done) => {
                chai.request(server)
                .post('/api/exercise/new-user')
                .send({username: 'New User'})
                .end((err, res) => {
                    if(err) {
                        console.log(err)
                    } else {
                        assert.equal(res.body.username, 'New User')
                        assert.equal(res.status, 200)
                        id = res.body._id;
                    }
                    done();
                })
            });
            test('Test POST /api/exercise/add with userId=_id, description, duration and date(option)', (done) => {

                chai.request(server)
                .post('/api/exercise/add')
                .send({userId:id, description:"running", duration: "30", date: new Date().toISOString().slice(0,10) })
                .end((err, res) => {
                    if(err) console.log(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.description, 'running')
                    assert.equal(res.body.duration, '30')
                    assert.equal(res.body.date, new Date().toISOString().slice(0,10))
                    assert.equal(res.body.userId, id)
                    done();
                })
            })
        });
        
        suite('GET', () => {
            test('TEST GET /api/exercise/users array of all users', (done) => {
                chai.request(server)
                .get('/api/exercise/users')
                .end((err, res) => {
                    if(err) console.log(err)
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, "response shold be an array")   
                    done(); 
                })
            })
            test('TEST GET /api/exercise/log/id?={id} full exercise of a user with id', (done) => {
                chai.request(server)
                .get('/api/exercise/log')
                .query({id: id})
                .end((err, res) => {
                    if(err) console.log(err)
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, "response should be an array with log data")
                    expect(res.body[0]).to.eql({count:res.body.length-1});
                    // assert.equal(res.body[0], {count:res.body.length-1})
                    done();
                })
            })
            test('TEST GET /api/exercise/log/id?={id}[&limit] limit numbers of exercise\'s log of a user', (done) => {
                chai.request(server)
                .get('/api/exercise/log')
                .query({id: id,  limit:1})
                .end((err, res) => {
                    if(err) console.log(err)
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, "response should be an array")
                    expect(res.body[0]).to.eql({count:1});
                    assert.equal(res.body.length, 2)
                    done();
                })
            })
        })
       
    })
})