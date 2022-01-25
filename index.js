const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()
const articles = []
const newspapers = [
    {
        name: 'toi',
        address: 'https://timesofindia.indiatimes.com/topic/Artificial-Intelligence-and-Machine-Learning',
        base: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/technology/artificialintelligenceai',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraphindia.com/topic/machine-learning',
        base: 'https://www.telegraphindia.com'
    }
]


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html_var = response.data
        const $ = cheerio.load(html_var)

        $('a:contains("AI")',html_var).each(function () {
            const title = $(this).text()
            const url = newspaper.base + $(this).attr('href')
            articles.push({
                title,
                url,
                source : newspaper.name
            })
        })
    })
    .catch((error) => console.log(error))
})


// Main Path
app.get('/', (req,res) =>{
    res.json("WELCOME TO THIS TESTING SERVER")
} )

// News Path for all articles
app.get('/news', (req,res) => {
    res.json(articles)
})

// News Path for specific newspaper id
app.get('/news/:newspaperId', (req,res) => {
    const npspec_articles = []
    const newspaperId = req.params.newspaperId
    const newspaperInfo = newspapers.filter(newspaper => newspaper.name == newspaperId)[0]
    axios.get(newspaperInfo.address)
    .then((response) => {
        const html_var = response.data
        const $ = cheerio.load(html_var)
        $('a:contains("AI")',html_var).each(function () {
            const title = $(this).text()
            const url = newspaperInfo.base + $(this).attr('href')
            npspec_articles.push({
                title,
                url,
                source : newspaperInfo.name
            })            
        })
        res.json(npspec_articles)
    })
    .catch((error) => console.log(error)) 
})

app.listen(PORT, () => console.log(`Server is up and running on PORT: ${PORT}`))