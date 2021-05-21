const should = require("should");
const request = require("request");
const chai = require("chai"),
  chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const baseUrl = "http://www.omdbapi.com/";
const apiKey = "&apikey=83a364a1";

describe("Initial OMDb API test with no api key", () => {
  it("Should return a response 401 status code", (done) => {
    request.get({ url: baseUrl + "?t=thomas" }, (err, res, body) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

  it('Should return a body with a "False" response and error', (done) => {
    request.get({ url: baseUrl + "?t=thomas" }, (err, res, body) => {
      const parsedBody = JSON.parse(body);

      if (parsedBody.Error) {
        console.error(parsedBody.Error);
      }
      expect(parsedBody.Response).to.equal("False");
      expect(parsedBody.Error).to.equal("No API key provided.");
      done();
    });
  });
});

describe("OMDb API test with an API key", () => {
  it("Should return a response 200 status code", (done) => {
    request.get({ url: baseUrl + "?s=thomas" + apiKey }, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('Should return a response for search of "thomas"', (done) => {
    request.get({ url: baseUrl + "?s=thomas" + apiKey }, (err, res, body) => {
      const parsedBody = JSON.parse(body);

      if (parsedBody.Error) {
        console.error(parsedBody.Error);
      }

      parsedBody.Search.forEach((movie) => {
        expect(movie).to.be.a("object");
        expect(movie.Title).to.include("Thomas");
        expect(movie.should.have.property("Title"));
        expect(movie.should.have.property("Year"));
        expect(movie.should.have.property("imdbID"));
        expect(movie.should.have.property("Type"));
        expect(movie.should.have.property("Poster"));
        if (movie.Year.length === 9) {
          expect(movie.Year.substring(0, 4).length).to.equal(4);
          expect(movie.Year.substring(5, 9).length).to.equal(4);
          // Tried to use moment.js it was depreciated
        } else {
          expect(movie.Year.length).to.equal(4);
        }
      });
      done();
    });
  });

  it("Should verify each title on page 1 is accessible via imdbID", (done) => {
    request.get(
      { url: baseUrl + "?s=thomas&page=1" + apiKey },
      (err, res, body) => {
        const parsedBody = JSON.parse(body);

        if (parsedBody.Error) {
          console.error(parsedBody.Error);
        }
        parsedBody.Search.forEach((movie) => {
          request.get(
            { url: baseUrl + "?i=" + movie.imdbID + apiKey },
            (err, res, body) => {
              let result = JSON.parse(body);

              if (result.Error) {
                console.error(result.Error);
              }
              expect(result.should.have.property("Title"));
            }
          );
        });
        done();
      }
    );
  });

  it("Should verify none of the poster links on page 1 are broken", (done) => {
    request.get(
      { url: baseUrl + "?s=thomas&page=1" + apiKey },
      (err, res, body) => {
        const parsedBody = JSON.parse(body);

        if (parsedBody.Error) {
          console.error(parsedBody.Error);
        }
        parsedBody.Search.forEach((movie) => {
          const url = movie.Poster.split("images");
          chai
            .request(url[0])
            .get("images" + url[1])
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
            });
        });
        done();
      }
    );
  });

  it("Should verify there are no duplicate records across the first 5 pages", (done) => {
    let allMovies = [];
    for (let i = 1; i < 6; i++) {
      request.get(
        { url: baseUrl + "?s=thomas&page=" + i + apiKey },
        (err, res, body) => {
          const parsedBody = JSON.parse(body);

          if (parsedBody.Error) {
            console.error(parsedBody.Error);
          }
          allMovies.push(parsedBody.Search);

          parsedBody.Search.forEach((movie) => {
            const count = allMovies.flat().filter((a) => a === movie).length;
            expect(count).to.equal(1);
          });
        }
      );
    }
    done();
  });

  it("Should verify that a movie found by title has runtime in minutes", (done) => {
    request.get({ url: baseUrl + "?t=sky" + apiKey }, (err, res, body) => {
      const parsedBody = JSON.parse(body);

      if (parsedBody.Error) {
        console.error(parsedBody.Error);
      }
      expect(parsedBody.should.have.property("Runtime"));
      expect(parsedBody.Runtime).to.include("min");
      done();
    });
  });
});
