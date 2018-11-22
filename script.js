// https://www.youtube.com/watch?v=Fjmxh-gnBM0

// const options = {
// 	sortDir: 'high-low'
// }
const margin = {
    top: 60,
    right: 300,
    bottom: 90,
    left: 100
}
const width = 1000 - margin.right - margin.left
const height = 600 - margin.top - margin.bottom
const format = d3.format(",.0f")
const formatPercent = d3.format("%")

const svg = d3.select("#chart")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .classed("main-group", true)

const body = d3.select("body")

body.selectAll('select')
    .on('change', d => {
        let selectedValue = document.querySelector('#graphChoices').value;
        changeOrder(selectedValue)
    })

changeOrder = selectedValue => {
    switch (selectedValue) {
        case 'high-low':
			updateDataHighLow()
            console.log('highlow')
            break;
        case 'low-high':
            console.log('lowhigh')
			updateDataLowHigh()
            break;
    }
}

function updateDataHighLow() {
	d3.selectAll('rect').remove()
	d3.selectAll('text').remove()
    d3.json("data.json").then(function(data) {
        console.log("raw data:", data)

        // NEST
        const amountPerGender = d3.nest()
            .key(function(d) {
                return d.genre
            })
            .key(function(d) {
                return d.author.gender
            })
            .rollup(function(v) {
                return v.length
            })
            .entries(data)
            // maikel helped
            // to get the percentage in the array
            .map(d => {
                const total = d.values[0].value + d.values[1].value

                return {
                    ...d,
                    values: d.values.map(v => {
                        const genderAmount = v.value

                        return {
                            ...v,
                            percentage: genderAmount / total * 100
                        }
                    })
                }
            })

        const subjectsPerGenre = d3.nest()
            .key(function(d) {
                return d.genre
            })
            .key(function(d) {
                return d.topic
            })
            // .key(function(d) { return d.author.gender })
            .rollup(function(v) {
                return v.length
            })
            .entries(data)

        console.log("amountpergenre:", amountPerGender)

        // sorting
			amountPerGender.sort(function(a, b) {
				const aManPercentage = a.values.find(obj => obj.key == "Man").percentage
				const bManPercentage = b.values.find(obj => obj.key == "Man").percentage

	            if (aManPercentage > bManPercentage) {
	                return -1;
	            }
	            if (aManPercentage < bManPercentage) {
	                return 1;
	            }
	            return 0;
	        })
			console.log(amountPerGender)

        // MAX
        const max = d3.max(amountPerGender, function(d) {
            const menPercentage = getPercentageOfMen(d)
            const formatPercentage = format(menPercentage)
            return formatPercentage
        })

        // orinal because names of genre
        const xScale = d3.scaleBand()
            .rangeRound([0, width])
            .domain(amountPerGender.map(function(d) {
                return d.key
            }))
            .padding(0.5)

        // data so linear
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100])

        const xAxis = svg.append("g")
            .classed("xAxis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)")
            .attr("font-size", "1rem")
            .style("font-weight", "200")
            .attr("font-family", "sans-serif")

        const yAxis = svg.append("g")
            .classed("yAxis", true)
            .call(d3.axisLeft(yScale).tickFormat(d => d + "%"))
            .selectAll("text")
            .style("font-weight", "200")
            .attr("font-family", "sans-serif")
            .attr("font-size", "0.75rem")

        // bars
        svg.selectAll("rect")
            .data(amountPerGender)
			.attr("y", function(d) {
				const percentageOfMen = getPercentageOfMen(d)
				const formatPercentage = format(percentageOfMen)
				return height - yScale(formatPercentage)
			})
			.attr("height", 0)
            .enter()
            	.append("rect")
				.classed("man", true)
				.attr("x", function(d) {
					return xScale(d.key)
				})
            .attr("width", xScale.bandwidth())
			.attr("fill", function(d, i) {
				return "rgb(220, " + (200 - i * 10) + ", " + (210 + i * 10) + ")"
			})
			// https://www.youtube.com/watch?v=wsCOif7RMBo
			// this video helped me with the tooltip
			.on("mouseover", function() {
				tooltip.style("display", "block")
					.attr("class", "tooltip")
					.style("background", "red")
					// .style("cursor", "pointer");
					d3.select(this).style("cursor", "pointer")
			})
			.on("mouseout", function() {
				tooltip.style("display", "none")
				d3.select(this).style("cursor", "default")
			})
			.on("mousemove ", function(d) {
				const xPosition = d3.mouse(this)[0] - 20
				const yPosition = d3.mouse(this)[1] - 55
				const percentageOfMen = getPercentageOfMen(d)
				const formatPercentage = format(percentageOfMen)
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
				tooltip.select("text").text(
					formatPercentage + "%"
				)
			})
			.on("click", function(d) {
				const clickedSubject = subjectsPerGenre.filter(subject => d.key === subject.key)[0]
				subjects._groups[0][0].innerHTML = 0
				clickedSubject.values.forEach((v, i) => {
					// const p = document.createElement('p')
					// p.classList.add(`subjects--${v.key}`)
					// p.innerText = v.key
					// subjects2.appendChild(p)
					subjects.style("display", "block")
						.append("text")
						// .attr('class', d => `subjects--${v.key}`)
						.attr("x", 730)
						.attr("y", 30 + i * 22)
						.text(v.key)
						.attr("font-size", "0.75rem")
						.style("fill", "lightgray")
						.style("font-weight", "200")
						.attr("font-family", "sans-serif")
				})
			})
			.transition()
				.ease(d3.easeExp)
		   		.duration(900)
				.attr("height", function(d) {
					const percentageOfMen = getPercentageOfMen(d)
					const formatPercentage = format(percentageOfMen)
					return height - yScale(formatPercentage)
				})
				.attr("y", function(d) {
					const percentageOfMen = getPercentageOfMen(d)
					const formatPercentage = format(percentageOfMen)
					return yScale(formatPercentage)
				})


        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none")

        const div = document.createElement('div')

        // div.appendChild()

        const subjects = svg.append("g")
            .attr("class", "subjects")
            .style("display", "none")

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .style("fill", "lightgray")




        function getAmountOfMale(d) {
            return d.values.find(obj => obj.key == "Man").value
        }

        function getAmountOfFemale(d) {
            return d.values.find(obj => obj.key == "Vrouw").value
        }

        function getPercentageOfMen(d) {
            return d.values.find(obj => obj.key == "Man").percentage
        }

        // maikel helped with this
        // if you click on the window then remove the subjects element
        // but not if you clock on a bar (all bars have class man)
        window.addEventListener('click', (e) => {
            const barClicked = e.target.classList.contains('man')
            if (!barClicked) {
                subjects._groups[0][0].innerHTML = 0
            }
        })
    })
}
// }



function updateDataLowHigh() {
	d3.selectAll('rect').remove()
	d3.selectAll('text').remove()
    d3.json("data.json").then(function(data) {
        console.log("raw data:", data)

        // NEST
        const amountPerGender = d3.nest()
            .key(function(d) {
                return d.genre
            })
            .key(function(d) {
                return d.author.gender
            })
            .rollup(function(v) {
                return v.length
            })
            .entries(data)
            // maikel helped
            // to get the percentage in the array
            .map(d => {
                const total = d.values[0].value + d.values[1].value

                return {
                    ...d,
                    values: d.values.map(v => {
                        const genderAmount = v.value

                        return {
                            ...v,
                            percentage: genderAmount / total * 100
                        }
                    })
                }
            })

        const subjectsPerGenre = d3.nest()
            .key(function(d) {
                return d.genre
            })
            .key(function(d) {
                return d.topic
            })
            // .key(function(d) { return d.author.gender })
            .rollup(function(v) {
                return v.length
            })
            .entries(data)

        console.log("amountpergenre:", amountPerGender)

        // sorting
			amountPerGender.sort(function(a, b) {
				const aManPercentage = a.values.find(obj => obj.key == "Man").percentage
				const bManPercentage = b.values.find(obj => obj.key == "Man").percentage

	            if (aManPercentage > bManPercentage) {
	                return 1;
	            }
	            if (aManPercentage < bManPercentage) {
	                return -1;
	            }
	            return 0;
	        })
			console.log(amountPerGender)

        // MAX
        const max = d3.max(amountPerGender, function(d) {
            const menPercentage = getPercentageOfMen(d)
            const formatPercentage = format(menPercentage)
            return formatPercentage
        })

        // orinal because names of genre
        const xScale = d3.scaleBand()
            .rangeRound([0, width])
            .domain(amountPerGender.map(function(d) {
                return d.key
            }))
            .padding(0.5)

        // data so linear
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100])

        const xAxis = svg.append("g")
            .classed("xAxis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)")
            .attr("font-size", "1rem")
            .style("font-weight", "200")
            .attr("font-family", "sans-serif")

        const yAxis = svg.append("g")
            .classed("yAxis", true)
            .call(d3.axisLeft(yScale).tickFormat(d => d + "%"))
            .selectAll("text")
            .style("font-weight", "200")
            .attr("font-family", "sans-serif")
            .attr("font-size", "0.75rem")

        // bars
		svg.selectAll("rect")
            .data(amountPerGender)
			.attr("y", function(d) {
				const percentageOfMen = getPercentageOfMen(d)
				const formatPercentage = format(percentageOfMen)
				return height - yScale(formatPercentage)
			})
			.attr("height", 0)
            .enter()
            	.append("rect")
				.classed("man", true)
				.attr("x", function(d) {
					return xScale(d.key)
				})
            .attr("width", xScale.bandwidth())
			.attr("fill", function(d, i) {
				return "rgb(220, " + (200 - i * 10) + ", " + (210 + i * 10) + ")"
			})
			// https://www.youtube.com/watch?v=wsCOif7RMBo
			// this video helped me with the tooltip
			.on("mouseover", function() {
				tooltip.style("display", "block")
					.attr("class", "tooltip")
					.style("background", "red")
					// .style("cursor", "pointer");
					d3.select(this).style("cursor", "pointer")
			})
			.on("mouseout", function() {
				tooltip.style("display", "none")
				d3.select(this).style("cursor", "default")
			})
			.on("mousemove ", function(d) {
				const xPosition = d3.mouse(this)[0] - 20
				const yPosition = d3.mouse(this)[1] - 55
				const percentageOfMen = getPercentageOfMen(d)
				const formatPercentage = format(percentageOfMen)
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
				tooltip.select("text").text(
					formatPercentage + "%"
				)
			})
			.on("click", function(d) {
				const clickedSubject = subjectsPerGenre.filter(subject => d.key === subject.key)[0]
				subjects._groups[0][0].innerHTML = 0
				clickedSubject.values.forEach((v, i) => {
					// const p = document.createElement('p')
					// p.classList.add(`subjects--${v.key}`)
					// p.innerText = v.key
					// subjects2.appendChild(p)
					subjects.style("display", "block")
						.append("text")
						// .attr('class', d => `subjects--${v.key}`)
						.attr("x", 730)
						.attr("y", 30 + i * 22)
						.text(v.key)
						.attr("font-size", "0.75rem")
						.style("fill", "lightgray")
						.style("font-weight", "200")
						.attr("font-family", "sans-serif")
				})
			})
			.transition()
				.ease(d3.easeExp)
		   		.duration(900)
				.attr("height", function(d) {
					const percentageOfMen = getPercentageOfMen(d)
					const formatPercentage = format(percentageOfMen)
					return height - yScale(formatPercentage)
				})
				.attr("y", function(d) {
					const percentageOfMen = getPercentageOfMen(d)
					const formatPercentage = format(percentageOfMen)
					return yScale(formatPercentage)
				})

        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none")

        const div = document.createElement('div')

        // div.appendChild()

        const subjects = svg.append("g")
            .attr("class", "subjects")
            .style("display", "none")

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .style("fill", "lightgray")



        // subjects.append("text")


		// document.querySelector('#sort').addEventListener('click', updateData)


        function getAmountOfMale(d) {
            return d.values.find(obj => obj.key == "Man").value
        }

        function getAmountOfFemale(d) {
            return d.values.find(obj => obj.key == "Vrouw").value
        }

        // function getPercentageOfMen(d) {
        //     const men = d.values.find(obj => obj.key == "Man").value
        //     const women = d.values.find(obj => obj.key == "Vrouw").value
        //     const total = men + women
        //     const percentage = men / total * 100
        //     return percentage
        // }

        function getPercentageOfMen(d) {
            return d.values.find(obj => obj.key == "Man").percentage
        }

        // maikel helped with this
        // if you click on the window then remove the subjects element
        // but not if you clock on a bar (all bars have class man)
        window.addEventListener('click', (e) => {
            const barClicked = e.target.classList.contains('man')
            if (!barClicked) {
                subjects._groups[0][0].innerHTML = 0
            }
        })
    })
}
