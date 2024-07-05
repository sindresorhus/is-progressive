import type {IncomingMessage} from 'node:http';
import https from 'node:https';
import {expectType} from 'tsd';
import isProgressive from './index.js';

expectType<Promise<boolean>>(isProgressive.file('baseline.jpg'));
expectType<boolean>(isProgressive.fileSync('progressive.jpg'));
https.get('/', (response: IncomingMessage) => {
	expectType<Promise<boolean>>(isProgressive.stream(response));
});
expectType<boolean>(isProgressive.buffer(Buffer.from('1')));
