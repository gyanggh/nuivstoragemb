import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { upload, uploadProgress, uploadClear } from '../actions/videoUpload';

export interface UploadState {
    [id:string] : {
        progress : number;
        done : boolean;
        title: string;
    };
}

const uploadStartedReducer = (state: UploadState, payload: {id:string, title:string}) => ({
    ...state,
    [payload.id] : {
        title: payload.title,
        progress : 0,
        done : false,
    },
});

const uploadDoneReducer = (state: UploadState, payload: {result:{id:string}}) => ({
    ...state,
    [payload.result.id] : {
        ...state[payload.result.id],
        progress : 1,
        done : true,
    },
});

const uploadProgressReducer = (state: UploadState, [id, progress]: [string, number]) => ({
    ...state,
    [id] : {
        ...state[id],
        progress,
    },
});

const uploadClearReducer = (state: UploadState, id : string) => {
    const { [id]:discard, ...rest } = state;
    return rest;
};

export const uploadReducer =
    reducerWithInitialState({})
        .case(upload.async.started, uploadStartedReducer)
        .case(upload.async.done, uploadDoneReducer)
        .case(uploadProgress, uploadProgressReducer)
        .case(uploadClear, uploadClearReducer)
        .build();
