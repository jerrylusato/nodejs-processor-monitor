import { cpus as _cpus } from 'os';
import mailgun from "mailgun-js";

// processor load calculator
const processorLoad = () => {
    const cpus = _cpus();
    const len = cpus.length;
    let totalTime = 0;
    let totalIdleTime = 0;
    for (let i = 0; i < len; i++) {
        const cpu = cpus[i];
        totalIdleTime += cpu.times.idle;
        for (let time in cpu.times) {
            totalTime += cpu.times[time];
        }
    }
    return (100 * (1 - (totalIdleTime / totalTime))).toFixed(1);
};

// email server setup
const mailgunClient = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN
});

setInterval(() => {
    const load = processorLoad();
    if (load > 70) { // check processor load
        // send email notification & log if load is not optimal
        mailgunClient.messages().send({
            from: "Server <jeremiahlst@gmail.com>",
            to: "jeremiahlusato@gmail.com",
            subject: "Processor load",
            text: "Server processor load is not optimal now!"
        }, error => {
            error ? console.log(error) :
                console.log("Processor load not optimal. Email notification sent!");
        });
    }
}, 1000); // checks processor load every second
