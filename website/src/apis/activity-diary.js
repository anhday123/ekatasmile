import { get } from './httpClient'

export const apiAllActivityDiary = () => get('/action/getaction');
export const apiSearchActivityDiary = (object) => get('/action/getaction', object);

