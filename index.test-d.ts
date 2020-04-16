import {expectType} from 'tsd';
import * as https from 'https';
import isProgressive = require('.');

expectType<Promise<boolean>>(isProgressive.file('baseline.jpg'));
expectType<boolean>(isProgressive.fileSync('progressive.jpg'));
https.get('/', response => {
	expectType<Promise<boolean>>(isProgressive.stream(response));
});
expectType<boolean>(isProgressive.buffer(Buffer.from(1)));
