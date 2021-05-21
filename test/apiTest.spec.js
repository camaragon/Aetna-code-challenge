const should = require('should');
// const moment = require('moment');
const request = require('request');
const chai = require('chai')
    , chaiHttp = require('chai-http');
chai.use(chaiHttp);
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
                    // Tried to use moment.js it was depreciated
                } else {
                    expect(object.Year.length).to.equal(4);
                }
            })
            done();
        })
    })

    it('Should verify each title on page 1 is accessible via imdbID', (done) => {
        request.get({url: baseUrl + '?s=thomas&page=1' + apiKey}, (err, res, body) => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = {};
            }
            // console.log(parsedBody)
            parsedBody.Search.forEach(movie => {
                request.get({url: baseUrl + '?i=' + movie.imdbID + apiKey}, (res, body) => {
                    // console.log('hi', body.body)
                    let result = {};
                    try {
                        result = JSON.parse(body.body)
                    }
                    catch(err) {
                        result = {};
                    }
                    // console.log(result)
                    expect(result.should.have.property('Title'));
                })
            })
            
            done();
            // expect(object.should.have.property('Title'));
        })
    })

    it('Should verify none of the poster links on page 1 are broken', (done) => {
        request.get({url: baseUrl + '?s=thomas&page=1' + apiKey}, (err, res, body) => {
            let parsedBody = {};
            try {
                parsedBody = JSON.parse(body)
            }
            catch(err) {
                parsedBody = {};
            }

            parsedBody.Search.forEach(movie => {
                // console.log(movie.Poster)
                const url = movie.Poster.split('images');
                console.log(url)
                chai.request(url[0])
                    .get('images' + url[1])
                    .end( (err, res) => {
                        console.log('res', res.statusCode)
                        expect(res.statusCode).to.equal(200);
                    })
                })
        })
        done();
    })

    it.only('Should verify there are no duplicate records across the first 5 pages', (done) => {
        let allMovies = [];
        request.get({url: baseUrl + '?s=thomas&page=1' + apiKey}, (err, res, body) => {
            let parsedBody = JSON.parse(body);
            allMovies.push(parsedBody.Search)
            // console.log(allMovies)
        })
        request.get({url: baseUrl + '?s=thomas&page=2' + apiKey}, (err, res, body) => {
            let parsedBody = JSON.parse(body);
            allMovies.push(parsedBody.Search)
            console.log(allMovies)
        })

        if (allMovies.length > 0) {
            // console.log(allMovies)
        }
        // for (let i = 1; i < 6; i++) {
        //     request.get({url: baseUrl + '?s=thomas&page=' + i + apiKey}, (err, res, body) => {
        //         let parsedBody = {};
        //         try {
        //             parsedBody = JSON.parse(body)
        //         }
        //         catch(err) {
        //             parsedBody = {};
        //         }
        //         // console.log(`${i}`, parsedBody.Search)
                
        //         allMovies.push(parsedBody.Search)

        //         // input: objects from first 5 pages
        //         // output: if one of the 
               
        //     })
        // }
        // console.log(allMovies.length)
        // expect(allMovies.length)
        done()
    })

    it('Should ', () => {

    })
    
})