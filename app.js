
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = 3000;
// const herokuPort = process.env.PORT;

const mailchimpApiKey = `e32a4a2fa43a06aca7152ede58ccb95b-us21`
const mailchimpListId = `abd11110cc`

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // console.log(firstName);
    // console.log(lastName);
    // console.log(email);

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = `https://us21.api.mailchimp.com/3.0/lists/${mailchimpListId}`
    const options = {
        method: 'POST',
        auth: `hadi:${mailchimpApiKey}`
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on('data', (data) => {
            console.log(JSON.parse(data));
        //     // var feedback = JSON.parse(data);
        //     // console.log(feedback.errors);
        //     // console.log(feedback.error_count);
        //     if (response.statusCode === 200) {
        //         // if (feedback.error_count < 1) {
        //         //     res.sendFile(__dirname + '/success.html');
        //         // }
        //         // else {
        //         //     res.sendFile(__dirname + '/failure.html');
        //         // }
        //         res.sendFile(__dirname + '/success.html');
        //     }
        //     else {
        //         res.sendFile(__dirname + '/failure.html');
        //     }
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/failure', (req, res) => {
    res.redirect('/');
})

app.post('/success', (req, res) => {
    res.redirect('/');
})


app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port 3000`);
})