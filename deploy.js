const { exec } = require('child_process');

exec('git add . && git commit -m "Deploy to gh-page" && git push origin gh-page', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error: ${err.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Stdout: ${stdout}`);
});
