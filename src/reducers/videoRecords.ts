import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { fetchRecords, editRecord, addRecord } from '../actions/videoRecords';

export interface RecordState {
    records : Record[];
    lastIndex : any;
}

export interface RecordSubmitted {
    readonly id?: string;
    tags : RecordTags;
    user?: string;
    teacher?: string;
    readonly uploaded?: boolean;
    timestamp?: number;
    formats?: string[];
}

export type Record = Required<RecordSubmitted>;

export interface RecordTags {
    [key : string] : string | number;
}

const INITAL_RECORD_STATE: RecordState = {
    // tslint:disable-next-line
    records:JSON.parse("{\"items\":[{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":true,\"id\":\"64522a2e-f4a2-432a-97f3-6e071bb1786a\",\"tags\":{},\"timestamp\":1534896867866},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":true,\"id\":\"0019b51a-57e0-4ce6-870c-cd35e727a107\",\"tags\":{},\"timestamp\":1534896867866},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"2ec84cb4-e80f-440a-aedd-e2c918ccd234\",\"tags\":{},\"timestamp\":1535238063479},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"4444bc3f-487d-4343-bca0-f9fd85e0adc5\",\"tags\":{},\"timestamp\":1535238077454},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"225a7723-28e9-4255-947f-1fdfe9154714\",\"tags\":{},\"timestamp\":1535238095634},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"395a8df5-98a4-4007-b4a9-b83d6402d8e9\",\"tags\":{},\"timestamp\":1535238109386},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"4af24d72-9ebe-410f-8da2-327c1c89c5b4\",\"tags\":{},\"timestamp\":1535238115779},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"70d69d8f-ecea-4e63-ae68-44d236eaa9a0\",\"tags\":{},\"timestamp\":1535238123395},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"1d670f58-b1db-41da-8c05-a77ecc099203\",\"tags\":{},\"timestamp\":1535238126344},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"e38b08b6-136e-48ef-a566-62e1d528c391\",\"tags\":{},\"timestamp\":1535238127981},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"d2e4b8aa-db19-4c5c-8e73-623343435556\",\"tags\":{},\"timestamp\":1535238129671},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"6a5f2a68-6955-4c52-842f-62b3ea951f94\",\"tags\":{},\"timestamp\":1535238131338},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"b682527a-e8e8-42ed-a6ba-f2c986702a05\",\"tags\":{},\"timestamp\":1535238133235},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"bc39e0d2-152d-444f-83df-617d073f1b6b\",\"tags\":{},\"timestamp\":1535238134555},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"10a62dcf-ffec-4434-b71b-cd4f26c0e4e1\",\"tags\":{},\"timestamp\":1535238136134},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"c428b57b-02f1-42a8-aa43-0523ce1fcd69\",\"tags\":{},\"timestamp\":1535238137583},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"67251894-eb60-4685-8b07-03c662dadd03\",\"tags\":{},\"timestamp\":1535238139381},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"715e84c7-fc36-4813-939b-96ffed4c253e\",\"tags\":{},\"timestamp\":1535238141123},{\"user\":\"TestStudent\",\"teacher\":\"TestTeacher\",\"uploaded\":false,\"id\":\"a5f50e8b-8526-48bc-b5d9-a1c7a942c33f\",\"tags\":{},\"timestamp\":1535238142848},{\"teacher\":\"TestTeacher\",\"timestamp\":1535268937008,\"user\":\"TestStudent\",\"formats\":[],\"id\":\"fa824a84-cc99-4367-b36b-ee70e80c9fe5\",\"uploaded\":false,\"tags\":{\"tags\":{}}},{\"teacher\":\"TestTeacher\",\"timestamp\":1535269070640,\"user\":\"TestStudent\",\"formats\":[],\"id\":\"c51663b7-6c15-4aed-8de2-19f885c82c92\",\"uploaded\":false,\"tags\":{\"tags\":{\"few\":\"wef\"}}},{\"teacher\":\"TestTeacher\",\"timestamp\":1535269184448,\"user\":\"TestStudent\",\"formats\":[],\"id\":\"c028683b-3e53-4609-a454-08c871395386\",\"uploaded\":false,\"tags\":{\"few\":\"wef\",\"iuio\":\"kjkj\"}}]}").items,
    lastIndex : undefined,
};

const fetchRecordsReducer = (state: RecordState, payload : {
    result: {
        records : Record[];
        lastIndex : any;
    };
}) => ({
    ...state,
    lastIndex : payload.result.lastIndex,
    records : [...state.records, ...payload.result.records.filter(item => item.uploaded)],
});

const editRecordReducer = (state: RecordState, payload : {
    result : {
        record: Record,
        index?: number,
    };
}) => {
    if (payload.result.index == null || state.records[payload.result.index] == null) return state;
    return {
        ...state,
        records : state.records.map(
            (item, index) => index === payload.result.index ? payload.result.record : item,
        ),
    };
};

const addRecordReducer = (state: RecordState, payload : {
    result: Record;
}) => ({
    ...state,
    records : [...state.records, payload.result],
});

export const recordReducer =
    reducerWithInitialState(INITAL_RECORD_STATE)
        .case(fetchRecords.async.done, fetchRecordsReducer)
        .case(editRecord.async.done, editRecordReducer)
        .case(addRecord.async.done, addRecordReducer)
        .build();
