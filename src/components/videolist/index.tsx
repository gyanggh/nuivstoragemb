import * as React from 'react';
import { AsyncReactor } from '@ovotech/async-reactor-ts';
import Loader from 'react-loader-spinner';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { store, State } from '../../store';
import { goBack } from 'connected-react-router';
import * as Primatives from './videoEditor';
import { getRecord,
    editRecord, addVideo, fetchRecords, addComment } from '../../actions/videoRecords';
import { setSearchWord, openModal, closeModal,
    toggleAdvancedSearch } from '../../actions/ui';
import { ModalState } from '../../reducers/ui';
import { RecordSubmitted, Record } from '../../reducers/videoRecords';
import { translate, authListener } from '../../helpers';
import { createSelector } from 'reselect';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// tslint:disable-next-line
// const FoldableTableHOC = require('react-table/lib/hoc/foldableTable');
// const FoldableTable = FoldableTableHOC(ReactTable) as React.ComponentType<Partial<TableProps>>;
import * as moment from 'moment';
import { union } from 'lodash';
import { FormGroup, Input, Button, Label } from 'reactstrap';
// import VideoThumbnail from 'react-video-thumbnail';
// import AutoScale from 'react-auto-scale';
// import { getVideo } from '../../actions/videoUpload';

export const EditRecord = (id:string, close : () => void) =>
    (<AsyncReactor loader={() => getRecord(store.getState(), id)}>
        {({ loading, result }) => (loading ? <Loader type="Oval"/> :(
                result != null ? <Primatives.EditRecord
                    record={result.record}
                    submit={(record : RecordSubmitted) => {
                        store.dispatch(editRecord.action({
                            record,
                            id,
                            index: result.index,
                        }) as any);
                        close();
                    }}
                    cancel={close}
                    addComment={(comment:string) => store.dispatch(addComment.action({
                        id,
                        comment,
                        index: result.index,
                    }) as any)}
                /> : <h1> {translate('No such record!')} </h1>
            ))}
    </AsyncReactor>);

export const NewRecord = (close : () => void) => (
    <Primatives.NewRecord
        submit={(record : RecordSubmitted, video: File) => {
            store.dispatch(addVideo(record, video) as any);
            close();
        }}
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
    refresh: () => dispatch(fetchRecords.action({
        restart : true,
    }) as any),
    toggleSearch: () => dispatch(toggleAdvancedSearch()),
});

authListener.onAuth(() => store.dispatch(fetchRecords.action({
    restart:true,
}) as any));

type VideosListProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const VideosListElem = (props : VideosListProps) => (
   <div>
        <h1 className="pt-2"> {translate('Video Listing')} </h1>
        {!props.advancedSearch ? <FormGroup inline>
            <Label>Search:</Label>
            <Input value={props.searchWord} onChange={ev => props.search(ev.target.value)}/>
        </FormGroup> : null}
        <Button onClick={props.toggleSearch}>Toggle Advanced Search</Button>
        <Button className="float-right" onClick={props.refresh}>
            <span className="fa fa-refresh"/>
        </Button>
        <ReactTable
        data={props.records}
        getTrProps={(state : any, rowInfo: any, column: any) => ({
            onClick: (e : any, handleOriginal: any) => {
                props.openModal({
                    children: [
                        rowInfo.original.title || translate('Untitled Video'),
                        EditRecord(rowInfo.original.id, props.closeModal),
                        '',
                    ],
                    direction: 'right',
                });
                if (handleOriginal) {
                    handleOriginal();
                }
            },
        })}
        filterable={props.advancedSearch}
        /*{
            Header:translate('Thumbnail'),
            id: 'Thumbnail',
            accessor: obj => obj,
            Cell : props =>
            <AutoScale>
                <VideoThumbnail videoUrl={getVideo(props.value)} height={100} />
            </AutoScale>,
        },*/
        columns={[{
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
