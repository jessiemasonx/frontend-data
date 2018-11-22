// most of this file is with help from Maikel and Chelsea
const fs = require("fs")

// it goes 1 element deeper everytime but first checks if it's there
// if not, it returns undefined

const getAuthorFromResult = (result) => {
    return result.authors
        && result.authors["main-author"]
        && result.authors["main-author"].$t
		&& getFirstNameAndGender(result.authors["main-author"].$t)
        || undefined
}

const getTopicFromResult = (result) => {
    return result.subjects
        && result.subjects["topical-subject"]
        && result.subjects["topical-subject"].$t
        || ""
}

const getTitleFromResult = (result) => {
    return result.titles
        && result.titles.title
        && result.titles.title.$t
        || undefined
}

const getPublicationYearFromResult = (result) => {
    return result.publication
        && result.publication.year
        && result.publication.year.$t
		&& Number(result.publication.year.$t)
        || undefined
}

const getGenreFromResult = (result) => {
    return result.genres
        && result.genres.genre
        && result.genres.genre.$t
        || undefined
}

const getLanguageFromResult = (result) => {
    return result.languages
        && result.languages.language
        && result.languages.language.$t
        || undefined
}

const getFirstNameAndGender = (author) => {
	// split the name at the comma so first and last name are seperate
	const authorFirstNameLastName = author && typeof author === 'string'  && author.split(", ")
	// console.log(authorFirstNameLastName)
	// first name is second part and last name is the first part
	// so to get the first name you get the second [1] part
	let firstName = authorFirstNameLastName && authorFirstNameLastName[1]
	// first dot that you find in the name
	const firstDot = firstName && firstName.indexOf(".")
	// if no dot then -1
	// put the name without dots on falsy so dont use it
	const hasDots = firstDot && firstDot !== -1
	const transformedFirstName = removeDots(hasDots, firstName, firstDot)
	// set the transformed name as the first name
	const nameToUse = hasDots ? transformedFirstName : firstName
	return {
		name: nameToUse,
		gender: getGenderFromName(nameToUse)
	}
}

// credits to Maikel and Chelsea
const removeDots = (hasDots, firstName, firstDot) => {
	// letter before the dot
	const removeStartIndex = hasDots ? firstDot - 1 : undefined
	// last letter
	const endIndex = firstName && firstName.length
	// remove from letter before dot until last letter so only first name is left
	const tokensToRemove = firstName && removeStartIndex !== undefined && firstName.slice(removeStartIndex, endIndex)
	// remove the space
	const transformedFirstName = tokensToRemove && firstName.replace(tokensToRemove, "").trim()
	return transformedFirstName
}

// credits to wouter
const CACHE = {}
function getGenderFromName (firstname) {
	if (Object.keys(CACHE).length <= 0) {
		Object.assign(CACHE, JSON.parse(fs.readFileSync("./names.json", "utf8")))
	}
	const man = CACHE.mannen.find(name => name === firstname)
	const vrouw = CACHE.vrouwen.find(name => name === firstname)
	if (!(man || vrouw) || man && vrouw) return null // If no result or ambiguous return null.
	return (man && "Man") || (vrouw && "Vrouw")
}

// credits to Maikel and Chelsea
// the structure that how you return the data
// mapping over the results
const getTransformedResultFromResults = (results) => {
    return results
        ? results.map(result => ({
            author: getAuthorFromResult(result),
            title: getTitleFromResult(result),
            publicationYear: getPublicationYearFromResult(result),
            // language: getLanguageFromResult(result),
			genre: getGenreFromResult(result),
			// targetAudience: getTargetAudienceFromResult(result),
			topic: getTopicFromResult(result),
        }))
		// otherwise an empty array
        : []
}



// export all the function
module.exports = {
    getTransformedResultFromResults,
    getPublicationYearFromResult,
	getGenreFromResult,
}
