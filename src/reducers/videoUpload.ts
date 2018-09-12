import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { upload, uploadProgress, uploadClear } from '../actions/videoUpload';

export interface UploadState {
    order : string[];
    uploads : {
        [id:string] : {
            progress : number;
            done : boolean;
            title: string;
        };
    };
}

const INITAL_UPLOAD_STATE : UploadState = { uploads: {}, order: [] };

const uploadStartedReducer = (state: UploadState, payload: {id:string, title:string}) => ({
    ...state,
    uploads:{
        ...state.uploads,
        [payload.id] : {
            title: payload.title,
            progress : 0,
            done : false,
        },
    },
    order : [...state.order, payload.id],
});

const uploadDoneReducer = (state: UploadState, payload: {result:{id:string}}) => ({
    ...state,
    uploads: {
        ...state.uploads,
        [payload.result.id] : {
            ...state.uploads[payload.result.id],
            progress : 1,
            done : true,
        },
    },
});

const uploadProgressReducer = (state: UploadState, [id, progress]: [string, number]) => ({
    ...state,
    uploads : {
        ...state.uploads,
        [id] : {
            ...state.uploads[id],
            progress,
        },
    },
});

const uploadClearReducer = (state: UploadState, id : string) => {
    const { [id]:discard, ...rest } = state.uploads;
    return {
        uploads: rest,
        order : state.order.filter(ided => ided !== id),
    };
};

export const uploadReducer =
    reducerWithInitialState(INITAL_UPLOAD_STATE)
        .case(upload.async.started, uploadStartedReducer)
        .case(upload.async.done, uploadDoneReducer)
        .case(uploadProgress, uploadProgressReducer)
        .case(uploadClear, uploadClearReducer)
        .build();
