import express from 'express'
import dotenv from 'dotenv'
import { exec } from 'child_process'
import errorHtml from './errorHtml.js'

dotenv.config()

const app = express();
const jsonParser = express.json();

app.get("/faucet/:address/:token", function (req, res) {
    const token = req.params.token;
    if (token !== process.env.NODE_TG_BOT_TOKEN) {
        console.log('- not valid token')
        res.send(errorHtml(req.path))
        return
    }

    const address = req.params.address;
    if (!validateAddress(address)) {
        console.log('- not valid address')
        res.send(errorHtml(req.path))
        return
    }

    let result = false

    const nodeCommand = process.env.NODE_REEX_PATH +
        process.env.NODE_REEX_COMMAND1 +
        address +
        process.env.NODE_REEX_COMMAND2

    exec(nodeCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }

        try {
            let out = JSON.parse(stdout)
            // console.log(`stdout: ${stdout}`);

            if (out.code === 0) {
                console.log('- success faucet')
                result = true
            }
            else {
                console.log('- not success faucet, code =', out.code)
            }

            res.send(result);
        } catch (e) {
            console.log(`- JSON error: ${e}`)
            res.send(result);
        }
    });
});

app.get('/', (req, res) => {
    res.send('Hello! Is The <a href="http://reexcoin.com">REEX</a> faucet service! <a href="http://reexcoin.com">Go to REEX</a>')
})

app.listen(process.env.NODE_PORT, function () {
    console.log("Server started");
});

function validateAddress(address) {
    var regex = /^cosmos\w{39}$/;
    return regex.test(address)
}
