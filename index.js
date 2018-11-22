require("dotenv").config()

// packages

// extra
const chalk = require("chalk")
const d3 = require("d3")
const fs = require("fs")

// server and api
const express = require("express")
const obawrapper = require("node-oba-api-wrapper")
const app = express()
const port = 3000

// functions
const helpers = require("./helpers.js")

const obaApi = new obawrapper({
    public: process.env.PUBLIC,
    secret: process.env.SECRET
})

// Credits to Wouter
// used his api wrapper to get more then 20 results
const search = async (q, facet, count) => {
    return await obaApi.get("search", {
        q,
        librarian: true,
        refine: true,
        facet,
        count,
        filter: (result) => {
            // Credits to Maikel and Chelsea
            const publicationYear = helpers.getPublicationYearFromResult(result)
            const currentYear = new Date().getFullYear()
			return publicationYear >= currentYear - 40
			// return publicationYear === 2018
			&& helpers.getGenreFromResult(result)

			// filter on publicationYear from the last 30 years
			// return publicationYear >= currentYear - 30 &&

			// && helpers.getGenreFromResult(result)
            // return publicationYear === 2018
            // return publicationYear === currentYear - 3 &&
            //     helpers.getGenreFromResult(result) ||
            //     publicationYear === 2017 &&
            //     helpers.getGenreFromResult(result) ||
            //     publicationYear === 2016 &&
            //     helpers.getGenreFromResult(result) ||
                // publicationYear === 2015 &&
            //     helpers.getGenreFromResult(result)
            // return where is has a genre that is romantisch verhaal
        }
    })
}

(async () => {
    try {
        // q, facet, page
        // const results = await search("type:book", [], 1)
		const thriller = await search("genre:thriller", ["type(book)"], 300)
		const thriller2001 = await search("genre:thriller", ["type(book)", "pubYear(2001)"], 300)
		const thriller2008 = await search("genre:thriller", ["type(book)", "pubYear(2008)"], 300)
       	const roman = await search("genre:romantisch-verhaal", ["type(book)"], 300)
		const roman2001 = await search("genre:romantisch-verhaal", ["type(book)", "pubYear(2001)"], 300)
		const roman2008 = await search("genre:romantisch-verhaal", ["type(book)", "pubYear(2008)"], 300)
		// const sprookjes = await search("genre:sprookjes", ["type(book)"], 300)
		// const sprookjes2001 = await search("genre:sprookjes", ["type(book)", "pubYear(2001)"], 300)
		const sciencefiction = await search("genre:science-fiction", ["type(book)"], 300)
		const sciencefiction2001 = await search("genre:science-fiction", ["type(book)", "pubYear(2001)"], 300)
		const sciencefiction2008 = await search("genre:science-fiction", ["type(book)", "pubYear(2008)"], 300)
		const dieren = await search("genre:dieren", ["type(book)"], 300)
		const dieren2001 = await search("genre:dieren", ["type(book)", "pubYear(2001)"], 300)
		const dieren2008 = await search("genre:dieren", ["type(book)", "pubYear(2008)"], 300)
		const school = await search("genre:school", ["type(book)"], 300)
		const school2001 = await search("genre:school", ["type(book)", "pubYear(2001)"], 300)
		const school2008 = await search("genre:school", ["type(book)", "pubYear(2008)"], 300)
		const sport = await search("genre:sport", ["type(book)"], 300)
		const sport2001 = await search("genre:sport", ["type(book)", "pubYear(2001)"], 300)
		const sport2008 = await search("genre:sport", ["type(book)", "pubYear(2008)"], 300)
		const biografie = await search("genre:biografie", ["type(book)"], 300)
		const biografie2001 = await search("genre:biografie", ["type(book)", "pubYear(2001)"], 300)
		const biografie2008 = await search("genre:biografie", ["type(book)", "pubYear(2008)"], 300)
		const detective = await search("genre:detective", ["type(book)"], 300)
		const detective2001 = await search("genre:detective", ["type(book)", "pubYear(2001)"], 300)
		const detective2008 = await search("genre:detective", ["type(book)", "pubYear(2008)"], 300)
		const stripverhaal = await search("genre:stripverhaal", ["type(book)"], 300)
		const stripverhaal2001 = await search("genre:stripverhaal", ["type(book)", "pubYear(2001)"], 300)
		const stripverhaal2008 = await search("genre:stripverhaal", ["type(book)", "pubYear(2008)"], 300)
     	const results =  [
			...thriller,
			...thriller2001,
			...thriller2008,
			...roman,
			...roman2001,
			...roman2008,
			...sciencefiction,
			...sciencefiction2001,
			...sciencefiction2008,
			...dieren,
			...dieren2001,
			...dieren2008,
			...school,
			...school2001,
			...school2008,
			...sport,
			...sport2001,
			...sport2008,
			...biografie,
			...biografie2001,
			...biografie2008,
			...detective,
			...detective2001,
			...detective2008,
			...stripverhaal,
			...stripverhaal2001,
			...stripverhaal2008
		]
        // Credits to Chelsea & Maikel
        // if you have results
        if (results) {
            // get the results from helpers.js
            const transformedResults = helpers.getTransformedResultFromResults(results)
            // get the authors from the results
            // const authors = transformedResults.map(result => result.author)
            // get the first names without the dots from helpers.js
            // const transformedAuthors = authors.map(helpers.getFirstNameAndGender)
            // get every first name and gender

            const filterResultsWithNameAndGender = transformedResults.filter(transformedResult => {
                return transformedResult.author
					&& transformedResult.author.name
					&& transformedResult.author.gender
            })
			console.log(filterResultsWithNameAndGender)
            app.get("/", (req, res) => res.json(filterResultsWithNameAndGender))
            app.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)))
			fs.writeFile('data.json', JSON.stringify(filterResultsWithNameAndGender), err => err && console.error(err))
        }
    } catch (error) {
        throw new Error(error)
    }
})()
