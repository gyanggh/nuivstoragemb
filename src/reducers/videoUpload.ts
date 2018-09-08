import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { upload, uploadProgress, uploadClear } from '../actions/videoUpload';

export interface UploadState {
    [title:string] : {
        progress : number;
        done : boolean;
    };
}

const uploadStartedReducer = (state: UploadState, payload: {title:string}) => ({
    ...state,
    [payload.title] : {
        progress : 0,
        done : false,
    },
});

const uploadDoneReducer = (state: UploadState, payload: {result:{title:string}}) => ({
    ...state,
    [payload.result.title] : {
        progress : 1,
        done : true,
    },
});

const uploadProgressReducer = (state: UploadState, [title, progress]: [string, number]) => ({
    ...state,
    [title] : {
        ...state[title],
        progress,
    },
});

const uploadClearReducer = (state: UploadState, title : string) => {
    const { [title]:discard, ...rest } = state;
    return rest;
};

export const uploadReducer =
    reducerWithInitialState({})
        .case(upload.async.started, uploadStartedReducer)
        .case(upload.async.done, uploadDoneReducer)
        .case(uploadProgress, uploadProgressReducer)
        .case(uploadClear, uploadClearReducer)
        .build();
