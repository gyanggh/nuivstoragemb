import * as React from 'react';
import { asyncReactor } from 'async-reactor';
import Loader from 'react-loader-spinner';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { store, State } from '../../store';
import { goBack } from 'connected-react-router';
import * as Primatives from './videoEditor';
import { getRecord, editRecord, addRecord, fetchRecords } from '../../actions/videoRecords';
import { setSearchWord, openModal } from '../../actions/ui';
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

export const EditRecord = (id:string, close : () => void) => asyncReactor(
    async () => (<Primatives.EditRecord
        record={await getRecord(id)}
        submit={(record : RecordSubmitted) => store.dispatch(editRecord.action({
            record,
            id,
        }) as any)}
        cancel={close}
    />),
    (<Loader type="Oval"/>));

export const NewRecord = (close : () => void) => (
    <Primatives.NewRecord
        submit={(record : RecordSubmitted) => store.dispatch(addRecord.action(record) as any)}
        cancel={close}
    />
);

export const EditRecordPage = (id:string) => EditRecord(id, () => store.dispatch(goBack()));

export const NewRecordPage = () => NewRecord(() => store.dispatch(goBack()));

const mapStateToProps = createSelector<State, Record[], string, {
    records : Record[];
    searchWord : string;
    tags : string[];
}>(
    state => state.records.records,
    state => state.ui.searchWord,
    (records, searchWord) => {
        const recordsFiltered = searchWord.trim() !== '' ? records.filter(
            record => Object.keys(record.tags || {})
            .reduce((a, key) => a || record.tags[key].toString().includes(searchWord), false),
        ) : records;
        return {
            searchWord,
            records : recordsFiltered,
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
    openModal,
    search : () => dispatch(setSearchWord),
    loadRows : () => dispatch(fetchRecords.action({
        restart : false,
    }) as any),
});

let firstLoad: boolean = true;
if (firstLoad) {
    firstLoad = false;
    new Promise(resolve => setTimeout(resolve, 1000)).then(
        () => store.dispatch(fetchRecords.action({
            restart : false,
        }) as any),
    );
}

type VideosListProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const VideosListElem = (props : VideosListProps) => (
   <div>
        <div> controls go here eventually </div>

        <ReactTable
        data={props.records}
        columns={[{
            Header:translate('Thumbnail'),
            accessor: 'id',
            Cell : () => <span> Coming soon! </span>,
        }, {
            Header:translate('Student'),
            accessor: 'user',
            Cell : (innerProps : any) => <span onClick={() => props.openModal({
                children : [
                    'User',
                    'Coming Soon!',
                    'Idk',
                ],
                direction : 'right',
            })}> {innerProps.value} </span>,
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
