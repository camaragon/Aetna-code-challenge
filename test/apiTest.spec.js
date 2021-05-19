const should = require('should');
const moment = require('moment');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const baseUrl = 'http://www.omdbapi.com/';
const apiKey = '&apikey=83a364a1'

describe('Initial OMDb API test with no api key', () => {
    
    it('Should return a response 401 status code', (done) => {
        request.get({url: baseUrl + '?t=thomas'}, (err, res, body) => {
            expect(res.statusCode).to.equal(401);
            done();
        })
    })

    it('Should return a body with a "False" response and error', (done) => {
        request.get({url: baseUrl + '?t=thomas'}, (err, res, body) => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = {};
            }

            expect(parsedBody.Response).to.equal('False');
            expect(parsedBody.Error).to.equal('No API key provided.');
            done();
        })
    })
})

describe('OMDb API test with an API key', () => {
    it('Should return a response 200 status code', (done) => {
        request.get({url: baseUrl + '?s=thomas' + apiKey}, (err, res, body) => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = {};
            }

            expect(res.statusCode).to.equal(200);
            // console.log(parsedBody)
            done();
        })
    })

    it('Should return a response for search of "thomas"', (done) => {
        request.get({url: baseUrl + '?s=thomas' + apiKey}, (err, res, body) => {
            let parsedBody = [];
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = [];
            }
            // console.log(parsedBody.Search);
            parsedBody.Search.forEach(object => {
                expect(object).to.be.a('object')
                expect(object.Title).to.include('Thomas');
                expect(object.should.have.property('Title'));
                expect(object.should.have.property('Year'));
                expect(object.should.have.property('imdbID'));
                expect(object.should.have.property('Type'));
                expect(object.should.have.property('Poster'));
                if (object.Year.length === 9) {
                    // console.log(object.Year)
                    // const years = object.Year.split('-');
                    // console.log('HELLOOOOOO', years)
                    expect(object.Year.substring(0, 4).length).to.equal(4);
                    expect(object.Year.substring(5, 9).length).to.equal(4);
                } else {
                    expect(object.Year.length).to.equal(4);
                }
            })
            done();
        })
    })

    
})