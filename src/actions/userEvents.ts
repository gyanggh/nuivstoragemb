import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { State } from '../store';
import { UserEvent } from '../reducers/userEvents';
import { apiRequest } from './videoRecords';
import { flatten, last } from 'lodash';

const actionCreator = actionCreatorFactory('userEvents');
const actionCreatorAsync = asyncFactory<State>(actionCreator);

export const fetchEvents = actionCreatorAsync<{
    rows?: number;
    restart : boolean;
}, {
    events : UserEvent[];
    lastIndex : any;
}>(
    'FETCH_EVENTS',
    async ({ rows = 100000, restart }, dispatch, getState) => {
        const records : UserEvent[][] = [];
        let lastIndex : any = restart ? undefined : getState().events.lastIndex;
        do {
            const res = await apiRequest({
                endpoint : '/getEvents',
                body : {
                    lastIndex,
                    limit : rows - records.map(record => record.length).reduce((a, b) => a + b, 0),
                },
                method : 'POST',
            });
            records.push(res.items);
            lastIndex = res.lastIndex;
            console.log(lastIndex);
        } while (records.length < rows && lastIndex != null);
        return {
            events : flatten(records),
            lastIndex : lastIndex || last(last(records)),
        };
    });
