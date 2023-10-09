require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./db');

const server = http.createServer(app);

const port = process.env.PORT || 4000;
const main = async () => {
  try {
    await connectDB();

    // fetch(`http://localhost:4000/api/v1/auth/register`, {
    //   body: JSON.stringify({
    //     name: 'ABU TAHER',
    //     email: 'taher267@gmail.com',
    //     password: 'taher267@gmail.com',
    //   }),
    //   mode: 'cors',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((d) => (d.status < 400 ? d.json() : d))
    //   .then(console.log)
    //   .catch((err) => console.error(err.message));
    server.listen(port, async () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
  } catch (e) {
    console.log('Database Error');
    console.log(e);
  }
};

main();
