import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';


const app = express();
const port = process.env.PORT || 5500;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname + '/public'))

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/menu.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);