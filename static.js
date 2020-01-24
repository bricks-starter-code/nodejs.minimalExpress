const express = require('express')
const path = require('path')
const app = express()

app.get('/', express.static(path.join(__dirname, "static")));

app.listen(3000, () => console.log('Example app listening on port 3000!'))
