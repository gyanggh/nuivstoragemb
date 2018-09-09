import * as React from 'react';
import { AsyncReactor } from '@ovotech/async-reactor-ts';
import Loader from 'react-loader-spinner';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { store, State } from '../../store';
import { goBack } from 'connected-react-router';
import * as Primatives from './videoEditor';
import { /*getRecord,*/
    editRecord, addRecord, fetchRecords, addComment } from '../../actions/videoRecords';
import { setSearchWord, openModal, closeModal,
    toggleAdvancedSearch } from '../../actions/ui';
import { ModalState } from '../../reducers/ui';
import { RecordSubmitted, Record } from '../../reducers/videoRecords';
import { translate } from '../../helpers';
import { createSelector } from 'reselect';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// tslint:disable-next-line
// const FoldableTableHOC = require('react-table/lib/hoc/foldableTable');
// const FoldableTable = FoldableTableHOC(ReactTable) as React.ComponentType<Partial<TableProps>>;
import * as moment from 'moment';
import { union } from 'lodash';
import { Hub } from 'aws-amplify';
import { FormGroup, Input, Button, Label } from 'reactstrap';

export const EditRecord = (id:string, close : () => void) =>
    (<AsyncReactor loader={() => Promise.resolve(JSON.parse(
        /* tslint:disable-next-line */
        `{"teacher":"TestTeacher","timestamp":1536470092783,"comments":{"6babcc29-14bb-4112-a693-7ab50580f6ea":{"user":"TestStudent","comment":"Another Test Comment","timestamp":1536473064668},"5dfa4017-b804-492e-8566-88bd9eb665bb":{"user":"TestStudent","comment":"Test Comment","timestamp":1536473052265}},"user":"TestStudent","formats":["mp4"],"uploaded":true,"description":"Test Video 1","id":"b1ad5c6f-15e4-4ca8-839d-c044966c237e","tags":{"testTag":1},"title":"test vid 1"}`)
    )/*getRecord(id)*/}>
        {({ loading, result }) => (loading ? <Loader type="Oval"/> :
            <Primatives.EditRecord
                record={result}
                submit={(record : RecordSubmitted) => store.dispatch(editRecord.action({
                    record,
                    id,
                }) as any)}
                cancel={close}
                addComment={(comment:string) => store.dispatch(addComment.action({
                    id,
                    comment,
                }) as any)}
            />)}
    </AsyncReactor>);

export const NewRecord = (close : () => void) => (
    <Primatives.NewRecord
        submit={(record : RecordSubmitted) => store.dispatch(addRecord.action(record) as any)}
        cancel={close}
    />
);

export const EditRecordPage = (id:string) => EditRecord(id, () => store.dispatch(goBack()));

export const NewRecordPage = () => NewRecord(() => store.dispatch(goBack()));

const mapStateToProps = createSelector<State, Record[], string, boolean, {
    records : Record[];
    searchWord : string;
    tags : string[];
    advancedSearch: boolean;
}>(
    state => state.records.records,
    state => state.ui.searchWord,
    state => state.ui.advancedSearch,
    (records, searchWord, advancedSearch) => {
        const recordsFiltered = searchWord.trim() !== '' ? records.filter(
            record => Object.keys(record.tags || {})
            .reduce((a, key) => a || record.tags[key].toString().includes(searchWord), false) ||
            ['user', 'teacher', 'title', 'description']
            .reduce((a, key) => a || (record[key] || '').includes(searchWord), false),
        ) : records;
        return {
            searchWord,
            advancedSearch,
            records : advancedSearch ? records : recordsFiltered,
            tags : union<string>(...recordsFiltered.map(
                rec => Object.keys(rec.tags)
                .filter(
                    tag => (typeof rec.tags[tag] === 'string' || typeof rec.tags[tag] === 'number'),
                ),
            )),
        };
    },
);

const mapDispatchToProps = (dispatch : Dispatch) => ({
    openModal : (props : ModalState) => dispatch(openModal(props)),
    closeModal : () => dispatch(closeModal()),
    search : (word: string) => dispatch(setSearchWord(word)),
    loadRows : () => dispatch(fetchRecords.action({
        restart : false,
    }) as any),
    toggleSearch: () => dispatch(toggleAdvancedSearch()),
});

const alex : any = {};

alex.onHubCapsule = (capsule : any) => {

    switch (capsule.payload.event) {
        case 'signIn':
        case 'configured':
            store.dispatch(fetchRecords.action({
                restart:false,
            }) as any);
            break;
        case 'signUp':
        case 'signOut':
        case 'signIn_failure':
            break;
    }
};

Hub.listen('auth', alex);

type VideosListProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const VideosListElem = (props : VideosListProps) => (
   <div>
        <h1 className="pt-2"> {translate('Video Listing')} </h1>
        {!props.advancedSearch ? <FormGroup inline>
            <Label>Search:</Label>
            <Input value={props.searchWord} onChange={ev => props.search(ev.target.value)}/>
        </FormGroup> : null}
        <Button onClick={props.toggleSearch}>Toggle Advanced Search</Button>
        <ReactTable
        data={props.records}
        getTrProps={(state : any, rowInfo: any, column: any) => ({
            onClick: (e : any, handleOriginal: any) => {
                props.openModal({
                    children: [
                        rowInfo.original.title || translate('Untitled Video'),
                        EditRecord(rowInfo.original.id, props.closeModal),
                        'Idk',
                    ],
                    direction: 'right',
                });
                if (handleOriginal) {
                    handleOriginal();
                }
            },
        })}
        filterable={props.advancedSearch}
        columns={[{
            Header:translate('Thumbnail'),
            accessor: 'id',
            Cell : () => <span> Coming soon! </span>,
        }, {
            Header:translate('Title'),
            accessor: 'title',
        }, {
            Header:translate('Student'),
            accessor: 'user',
            Cell : (innerProps : any) => <span> {innerProps.value} </span>,
            /* getProps : () => ({
                onClick: () => props.openModal({
                    children : [
                        'User',
                        'Coming Soon!',
                        'Idk',
                    ],
                    direction : 'right',
                }),
            }),*/
        }, {
            Header:translate('Teacher'),
            accessor: 'teacher',
            Cell : (innerProps : any) => <span onClick={() => props.openModal({
                children : [
                    'Teacher',
                    'Coming Soon!',
                    'Idk',
                ],
                direction : 'right',
            })}> {innerProps.value} </span>,
        }, {
            Header:translate('Time'),
            accessor: 'timestamp',
            Cell : (innerProps : any) => <span>{moment(innerProps.value).calendar()}</span>,
        }, ...props.tags.map(tag => ({
            Header:tag,
            accessor: 'tags.' + tag,
            foldable: true,
        }),
        )]}
        />
   </div>
);

export const VideosList = connect(mapStateToProps, mapDispatchToProps)(VideosListElem);
