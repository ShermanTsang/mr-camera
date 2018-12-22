import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

export default new Datastore({
  filename: path.join(remote.app.getPath('userData'), '/data.db'),
  autoload: true
});
