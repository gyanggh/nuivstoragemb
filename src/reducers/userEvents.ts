import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { fetchEvents } from '../actions/userEvents';

export interface EventsState {
    events : UserEvent[];
    lastIndex : any;
}

export interface UserEvent {
    id: string;
    user : string;
    teacher : string;
    event : {
        type : 'newVideo' | 'editVideo' | 'deleteVideo';
        id : string;
    } | {
        type : 'newComment' | 'editComment' | 'deleteComment' | 'newCommentOnVideo';
        id : string;
        commentId : string;
    } | {
        type : 'newUser' | 'editUser' | 'deleteUser';
        id : string;
    };
    timestamp : number;
}

const INITAL_EVENTS_STATE = {
    events: [],
    lastIndex: undefined,
};

const fetchEventsReducer = (state: EventsState, payload : {
    result: {
        events : UserEvent[];
        lastIndex : any;
    };
    params: {
        restart: boolean;
    }
}) => ({
    ...state,
    lastIndex : payload.result.lastIndex,
    events : [
        ...(payload.params.restart ? [] : state.events),
        ...payload.result.events,
    ],
});

export const eventReducer =
    reducerWithInitialState<EventsState>(INITAL_EVENTS_STATE)
        .case(fetchEvents.async.done, fetchEventsReducer)
        .build();
