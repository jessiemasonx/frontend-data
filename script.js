const margin = {
    top: 30,
    right: 300,
    bottom: 150,
    left: 100
}

const width = 1000 - margin.right - margin.left
const height = 600 - margin.top - margin.bottom
const format = d3.format(",.0f")
const formatPercent = d3.format("%")
const body = d3.select("body")

const svg = d3.select("#chart")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .classed("main-group", true)

// Got help from Guus
// when the select is changed the value changes
// and will call function changeOrder
// changeOrder executes 2 functions depending on the case which is the option selected
body.selectAll('select')
    .on('change', d => {
        let selectedValue = document.querySelector('#graphChoices').value;
        changeOrder(selectedValue)
    })

changeOrder = selectedValue => {
    switch (selectedValue) {
        case 'high-low':
            updateDataHighLow()
            break;
        case 'low-high':
            updateDataLowHigh()
            break;
    }
}

// when high to low is selected
function updateDataHighLow() {
    // to make sure the other svg doesn't go over this one
    d3.selectAll('rect').remove()
    d3.selectAll('text').remove()
    d3.json("data.json").then(function(data) {
        // nesting
        // counting the amount of books per gender
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
            // to calculate the percentage and add in into the array
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

        // nesting
        // showing me the topics per genre and how many times they're there
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

        // max value
        const max = d3.max(amountPerGender, function(d) {
            const menPercentage = getPercentageOfMen(d)
            const formatPercentage = format(menPercentage)
            return formatPercentage
        })

        // the keys are the genres
        // they will be shown on the x axis
        const xScale = d3.scaleBand()
            .rangeRound([0, width])
            .domain(amountPerGender.map(function(d) {
                return d.key
            }))
            .padding(0.5)

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100])

        // the group with the xAxis
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

        // the group with the y axis
        const yAxis = svg.append("g")
            .classed("yAxis", true)
            .call(d3.axisLeft(yScale).tickFormat(d => d + "%"))
            .selectAll("text")
            .style("font-weight", "200")
            .attr("font-family", "sans-serif")
            .attr("font-size", "0.75rem")

        // the bars
        svg.selectAll("rect")
            .data(amountPerGender)
            .attr("y", function(d) {
                const percentageOfMen = getPercentageOfMen(d)
                const formatPercentage = format(percentageOfMen)
                return height - yScale(formatPercentage)
            })
            .attr("height", 0) // setting the height as 0 first for the transition
            .enter()
            .append("rect")
            .classed("man", true)
            .attr("x", function(d) {
                return xScale(d.key)
            })
            .attr("width", xScale.bandwidth())
            .attr("fill", function(d, i) { // every bar a different color
                return "rgb(220, " + (200 - i * 10) + ", " + (210 + i * 10) + ")"
            })
            // https://www.youtube.com/watch?v=wsCOif7RMBo
            // this video helped me with the tooltip
            .on("mouseover", function() {
                tooltip.style("display", "block") // tooltip becomes visible
                    .attr("class", "tooltip")
                    .style("background", "red")
                d3.select(this).style("cursor", "pointer")
            })
            .on("mouseout", function() {
                tooltip.style("display", "none")
                d3.select(this).style("cursor", "default")
            })
            .on("mousemove ", function(d) {
                // tooltip follows mouse
                const xPosition = d3.mouse(this)[0] - 20
                const yPosition = d3.mouse(this)[1] - 55
                const percentageOfMen = getPercentageOfMen(d)
                const formatPercentage = format(percentageOfMen)
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
                tooltip.select("text").text(
                    formatPercentage + "%"
                )
            })
            // show topics when clicked on bar
            // maikel helped
            .on("click", function(d) {
                const clickedSubject = subjectsPerGenre.filter(subject => d.key === subject.key)[0]
                subjects._groups[0][0].innerHTML = 0
                clickedSubject.values.forEach((v, i) => {
                    subjects.style("display", "block")
                        .append("text")
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
                // height of the bars
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

        // x axis lable
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 300)
            .attr("y", height + 80)
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .attr("fill", "rgb(220, 130, 280)")
            .text("Genres")

        // y axis lable
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", "-4rem")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .attr("fill", "rgb(220, 130, 280)")
            .text("Percentage of men");

        // wouter helped
        // finds the 'percentage' where the key is man
        function getPercentageOfMen(d) {
            return d.values.find(obj => obj.key == "Man").percentage
        }

        // maikel helped
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

// when low to high is selected
function updateDataLowHigh() {
    d3.selectAll('rect').remove()
    d3.selectAll('text').remove()
    d3.json("data.json").then(function(data) {

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

        // max value
        const max = d3.max(amountPerGender, function(d) {
            const menPercentage = getPercentageOfMen(d)
            const formatPercentage = format(menPercentage)
            return formatPercentage
        })

        const xScale = d3.scaleBand()
            .rangeRound([0, width])
            .domain(amountPerGender.map(function(d) {
                return d.key
            }))
            .padding(0.5)

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

        // x axis lable
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 300)
            .attr("y", height + 80)
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .attr("fill", "rgb(220, 130, 280)")
            .text("Genres")

        // y axis lable
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", "-4rem")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .attr("fill", "rgb(220, 130, 280)")
            .text("Percentage of men");

        function getPercentageOfMen(d) {
            return d.values.find(obj => obj.key == "Man").percentage
        }

        window.addEventListener('click', (e) => {
            const barClicked = e.target.classList.contains('man')
            if (!barClicked) {
                subjects._groups[0][0].innerHTML = 0
            }
        })
    })
}
