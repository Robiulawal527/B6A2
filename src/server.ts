import { Server } from 'http';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
    try {
        server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

main();
