import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { Record, RecordSubmitted } from '../reducers/videoRecords';
import { State } from '../store';

const actionCreator = actionCreatorFactory('videoRecords');
const actionCreatorAsync = asyncFactory<State>(actionCreator);

const apiUrl = 'https://t5nfdpujx6.execute-api.us-west-2.amazonaws.com/Prod';
const userName = 'TestUser';

const apiRequest =
    (props: {
        endpoint : string,
        body?: object,
        method : 'GET' | 'POST' | 'PUT' | 'DELETE',
    }) => fetch(apiUrl + props.endpoint, {
        method : props.method,
        body : JSON.stringify(props.body),
    }).then(res => res.json());

export const fetchRecords = actionCreatorAsync<number, {
    records: Record[],
    lastIndex : object,
}>(
    'FETCH_RECORDS',
    (rows, dispatch, getState) =>
        apiRequest({
            endpoint : 'getVideos',
            body : {
                user : userName,
                lastIndex : getState().records.lastIndex,
                limit : rows,
            },
            method : 'GET',
        }).then(obj => ({
            records : obj.items,
            lastIndex : obj.lastIndex,
        })),
    );

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
            endpoint: 'video/' + id,
            body : record,
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
            endpoint: 'video/new',
            body: record,
            method : 'PUT',
        }),
    );

export const getRecord = (id:string) => apiRequest({
    endpoint : '/video/' + id,
    method : 'GET',
}) as Promise<Record>;
