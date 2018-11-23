https://jessiemasonx.github.io/frontend-data/

# Frontend Data

- [Process](#process)
- [Visualisation](#visualisation)
- [Plan / Outcome](https://github.com/jessiemasonx/frontend-data2/blob/master/README.md#plan--outcome)
- [Experience and opinion](#experience-and-opinion)
- [Credits and help](#credits-and-help)


## Process

In the beginning of the project I was just thinking about what I wanted to visualise. This was actually quite hard for me because I wanted to be original but there weren't a lot of variables I could choose from so to choose an original idea was tricky.

What I did was I looked at the API once again and wrote on a piece of paper what variables there were, and I wrote down 3 ideas that I had.

Eventually I came with an idea that I quite liked which was to show per genre how many books were written by a male or female. I wanted to do this in percentages. The reason I thought this was interesting is because I wanted to know if the genre really had an infuence on what gender wrote it. For example are more manly genres like sports really mostly written by men?   
I thought the best way to visualise this would be a bar chart, because in this way you can really compare the percentages with each other and see which genre was mostly written by men.

<img src="https://github.com/jessiemasonx/images/blob/master/schets.jpg">

Above you can see the idea I had. What I had in mind is that if the user clicked on a bar, that bar would turn into a stacked bar that shows the target audience used in that genre. However, after a while I realised this wouldn't be interesting, because all the books had the same target audience.

In the end I decided I was going to show the topics used in the books, per genre. So if a user clicked on a genre he would see what topics were used. I wanted to do this in a pie chart that popped up, but there were too many topics used so a pie chart would not be efficient because most topics would just be 1% percent. This is why I decided to just make a list of all the topics used. I thought this would be the most clear way.

I told about my idea in front of the class and I showed them these sketches:

<img src="https://github.com/jessiemasonx/images/blob/master/Artboard%201%20copy%40.png">
<img src="https://github.com/jessiemasonx/images/blob/master/Artboard%201%20copy%202%40.png">
<img src="https://github.com/jessiemasonx/images/blob/master/Artboard%201%20copy%203%40.png">

The feedback that the option to switch between men and women woudn't really necessary because If you can see that 40% is men you know 60% is women. Another thing that people said is that it would maybe be interesting to be able to sort on years too and be able to compare periods of time with eachother.

Finally I was sure about my idea and I was going to get my data. This didn't go very fluently in the beginning because the whole class was trying to get so many results at the same time, which made the API occasionally give us an internal server error.

But after a while when I had all the data I needed (which I changed several times because I found it hard to make up my mind) and I was ready to start working on d3.

My data looked something like this:

```json
{
    "author": {
        "name": "Simone",
        "gender": "Vrouw"
    },
    "title": "Op klaarlichte dag / Simone van der Vlugt",
    "publicationYear": 2012,
    "genre": "Thriller",
    "topic": "Verdwijningen"
}
```

I followed a few tutorials and read some documentation to get as much knowlegde as I needed to start working on my visualisation. My plan for this project was to __really try to figure out as many things possible by myself__. There are so many examples of bar charts online, but I didn't want to use anything because I wanted to write my code step-by-step to make sure I understood what I was doing. I really enjoyed doing it this way.

Ofcourse i'm not saying I did not get any help and I didn't use any code from the internet, because there are still many things i'm not able to do by myself. But when I did receive help, I wanted to make sure that I understood what it did.

## Visualisation

<img src="https://github.com/jessiemasonx/images/blob/master/graphnotopics.png">
<img src="https://github.com/jessiemasonx/images/blob/master/graphtopics.png">

What you see above is my end result. Per genre you can see what percentage out of the books are written by a man. You can see the order from most written by men to least written by men, and also the other way around so you can easily compare the genres with each other.

When you click on a bar a list of topics within that genre appears on the right and when you hover over the bars you see the percentage.

I found it very interesting to see that 92% of the comic books were written by men and only 8% of the romantic books were written by men, so the complete opposite.

## Plan / Outcome

At the start of the project I made a *to-do list* of all the things I wanted in my visualisation:

- [x] Show bars based on percentage
- [x] Sort bars from high to low
- [x] Sort bars from low to high
- [x] Show topics when clicked on bar
- [ ] Let user filter by time
- [x] Add tooltip that shows percentage
- [x] Add animations

As you can see, I did most of the things I had planned. But unfortunately, the user can not filter by time or compare different periods of time. I did not have enough time in the end to make sure this was possible.

I also wish I had enough time to make sure there was a graph showing when you enter the page, instead of having to change the option in the select to see a graph appear.

Another thing that I wanted to have done differently is that when I sort it creates a completely new bar chart, while all I needed to do is sort the bars a different way. This is something that's really bugging me because i've been trying to do this for a while but I just coulnd't work it out. So eventually I decided to make 2 functions for 2 charts, and show a different chart when the option in the select is changed.

## Experience and opinion

At the beginning of this project I was extremely excited. d3 was something I was very interested in already because of the last project, so I was triggered to learn more about it.

Something I loved about d3 in this project is that it was new for everyone. This was a nice thing for me because I know that compared to a lot of the others my knowlegde of everything in this *field* is not as much there's, but because this was new for everyone it kind off felt like everyone was on the same level again. This meant I could help others too and I really enjoyed that. There was less of a difference in level throughout the class than normally.

I feel like I learned so much during this project. Every day I knew a little more and every day it got a little easier because of that. I remember with the last projects when I looked at code examples of d3 I barely knew what was going on, but now there are so many things I understand when I look at d3 code.

d3.nest is one of my favourite things from d3. Before I knew anything about d3, I knew I needed the amount of books per genre and per gender and I thought it was going to be very hard for me to count that. But with d3.nest, it was counted for me and I could easily get it by using d.value or d.key etc.

I definitely think d3 is something I will use in the future when making data visualisations.

## Credits and help

### Online Sources
- [Introduction to D3.js - Bar Graph Tutorial](https://www.youtube.com/watch?v=Fjmxh-gnBM0) || Creating the bars - youtube video
- [D3js Tutorials: Part 13 - Adding Tooltips To Your Bar Graph](https://www.youtube.com/watch?v=wsCOif7RMBo) || Adding tooltip - youtube video
- [W3schools cursors](https://www.w3schools.com/cssref/pr_class_cursor.asp)
- [Learning Nest](http://learnjsdata.com/group_data.html) ❤️❤️❤️

### People
- [Linda de Haan](https://github.com/LindadeHaan)
- [Chelsea Doeleman](https://github.com/chelseadoeleman)
- [Maikel van Veen](https://github.com/Maikxx)
- [Wouter Lem](https://github.com/maanlamp)
- [Guus Dijkhuis](https://github.com/GuusDijkhuis)https://github.com/GuusDijkhuis
