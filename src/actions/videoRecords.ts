import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { Record, RecordSubmitted } from '../reducers/videoRecords';
import { State } from '../store';
import { last, flatten } from 'lodash';
import { Auth } from 'aws-amplify';
import { createSelector } from 'reselect';
import { upload } from './videoUpload';

const actionCreator = actionCreatorFactory('videoRecords');
const actionCreatorAsync = asyncFactory<State>(actionCreator);

const apiUrl = 'https://rfkgf56u78.execute-api.us-west-2.amazonaws.com/Prod';

export const apiRequest =
    async (props: {
        endpoint : string,
        body?: object | string,
        method : 'GET' | 'POST' | 'PUT' | 'DELETE',
    }) => {
        const session = await Auth.currentSession();
        const res = await fetch(apiUrl + props.endpoint, {
            method : props.method,
            headers : {
                Authorization: session.idToken.jwtToken,
            },
            // mode: 'no-cors',
            body : typeof props.body === 'string' ? props.body : JSON.stringify(props.body),
        });
        return res.json();
    };

export const fetchRecords = actionCreatorAsync<{
    rows?: number;
    restart : boolean;
}, {
    records : Record[];
    lastIndex : any;
}>(
    'FETCH_RECORDS',
    async ({ rows = 100000, restart }, dispatch, getState) => {
        const records : Record[][] = [];
        let lastIndex : any = restart ? undefined : getState().records.lastIndex;
        do {
            const res = await apiRequest({
                endpoint : '/getVideos',
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
            records : flatten(records),
            lastIndex : lastIndex || last(last(records)),
        };
    });

export const editRecord = actionCreatorAsync<{
    id:string;
    record: RecordSubmitted;
    index?: number;
}, {
    index ?: number;
    record: Record;
}>(
    'EDIT_RECORD',
    ({ id, record, index }) =>
        apiRequest({
            endpoint: '/video/' + id,
            body : record,
            method : 'POST',
        }).then(record => ({
            record,
            index,
        })),
    );

export const addComment = actionCreatorAsync<{
    id:string;
    comment: string;
    index?: number;
}, {
    index ?: number;
    record: Record;
}>(
    'ADD_COMMENT',
    ({ id, comment, index }) =>
        apiRequest({
            endpoint: '/video/' + id + 'comment/new',
            body : comment,
            method : 'POST',
        }).then(record => ({
            record,
            index,
        })),
    );

export const addRecord = actionCreatorAsync<RecordSubmitted, Record>(
    'ADD_RECORD',
    record =>
        apiRequest({
            endpoint: '/video/new',
            body: record,
            method : 'PUT',
        }),
    );

export const addVideo =
    (record: RecordSubmitted, video: File) => (async (dispatch : (a: any) => any) => {
        const { user, teacher, id, title } = await dispatch(addRecord.action(record) as any);
        return await dispatch(upload.action({
            user, teacher, id, title,
            file: video,
        }));
    });

export const getRecord = createSelector<State, string, [string, number], Record[], Promise<{
    record: Record;
    index?: number;
}>>(
    (state: State, id: string) =>
        [id, state.records.records.map(record => record.id === id).indexOf(true)],
    (state: State, id: string) => state.records.records,
    async ([id, index], records: Record[]) => index !== -1 ? Promise.resolve({
        index,
        record: records[index],
    }) : {
        record: await apiRequest({
            endpoint : '/video/' + id,
            method : 'GET',
        }),
    },
);
