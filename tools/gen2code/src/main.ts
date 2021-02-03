import { workspace } from './config';
import { loadDustTemplate } from './dust';

console.log(workspace());

loadDustTemplate('class');
loadDustTemplate('func');
loadDustTemplate('manager');
