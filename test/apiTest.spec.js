const should = require('should');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const baseUrl = 'http://www.omdbapi.com/';

describe('Initial OMDb API test', () => {
    it('Should return a response ', (done) => {
        request.get({url: baseUrl + '?t=thomas'}, (err, res, body) => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = {};
            }

            expect(res.statusCode).to.equal(200)

            done();
        })
    })
})