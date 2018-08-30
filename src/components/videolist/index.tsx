import * as React from 'react';
import { asyncReactor } from 'async-reactor';
import Loader from 'react-loader-spinner';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { store, State } from '../../store';
import { goBack } from 'connected-react-router';
import * as Primatives from './videoEditor';
import { getRecord, editRecord, addRecord, fetchRecords } from '../../actions/videoRecords';
import { setSearchWord } from '../../actions/ui';
import { RecordSubmitted, Record } from '../../reducers/videoRecords';
import { Table } from 'reactstrap';
// import { translate } from '../../helpers';
import { createSelector } from 'reselect';
// tslint:disable-next-line
// import { /* Table, Column, */ WindowScroller, AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import * as moment from 'moment';

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
}>(
    state => state.records.records,
    state => state.ui.searchWord,
    (records, searchWord) => ({
        searchWord,
        records : records.filter(
            record => Object.keys(record.tags)
            .map(key => record.tags[key].toString().includes(searchWord)),
        ),
    }),
);

const mapDispatchToProps = (dispatch : Dispatch) => ({
    search : () => dispatch(setSearchWord),
    loadRows : (n:number) => dispatch(fetchRecords.action(n) as any),
});

const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type VideosListProps = (typeof stateProps) & (typeof dispatchProps);

const VideosListElem = (props : VideosListProps) => (
    <Table>
        <thead>
            <tr>
                <th>id</th>
                <th>student</th>
                <th>teacher</th>
                <th>tags</th>
                <th>timestamp</th>
            </tr>
        </thead>
        <tbody>
            {props.records.map(record => (
                <tr>
                    <th scope="row">{record.id}</th>
                    <td>{record.user}</td>
                    <td>{record.teacher}</td>
                    <td><pre>{JSON.stringify(record.tags, null, 2)}</pre></td>
                    <td>{moment(record.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export const VideosList = connect(mapStateToProps, mapDispatchToProps)(VideosListElem);

/*

<WindowScroller
        scrollElement={window}>
            {({ height, isScrolling, registerChild, onChildScroll, scrollTop } : any) => (
                <AutoSizer disableHeight>
                    {({ width }) => (
                      <div ref={registerChild}>
                        <InfiniteLoader
                        isRowLoaded={({ index }) => index < props.records.length}
                        loadMoreRows={
                            ({ stopIndex }) => props.loadRows(stopIndex - props.records.length + 1)
                        }
                        rowCount={props.records.length}>
                        {({ onRowsRendered, registerChild } :
                            {onRowsRendered : any , registerChild: any}) => (
                            <List
                                width={width}
                                height={height}
                                auto
                                rowCount={props.records.length}
                                rowHeight={20}
                                rowRenderer={({ index }) =>
                                    <div> { props.records[index].id } </div>
                                }
                              />
                        )}
                    </InfiniteLoader>
                    </div>
                    )}
                </AutoSizer>
          )}
    </WindowScroller>

    <Table
                                wdth={300}
                                autoHeight
                                height={500}
                                headerHeight={20}
                                rowHeight={30}
                                rowCount={props.records.length}
                                rowGietter={({ index } : { index: number}) => props.records[index]}
                                ref={registerChild}
                                onRowsRendered={onRowsRendered}
                                // isScrolling={isScrolling}
                                // onScroll={onChildScroll}
                            >
                                <Column
                                    labeel={translate('ID (internal)')}
                                    dataKy="id"
                                    width={100}
                                />
                                <Column
                                    width={200}
                                    label={translate('Student')}
                                    dataKey="user"
                                />
                                <Column
                                    width={200}
                                    label={translate('Teacher')}
                                    dataKey="teacher"
                                />
                                <Column
                                    width={200}
                                    label={translate('Tags')}
                                    dataKey="tags"
                                    flexGrow={1}
                                    cellRenderer={
                                        (cellData:any) => <pre>JSON.stringify(cellData)</pre>
                                    }
                                />
                                <Column
                                    width={200}
                                    label={translate('Time')}
                                    dataKey="timestamp"
                                    cellRenderer={
                                        (cellData:any) => moment(cellData)
                                        .format('MMMM Do YYYY, h:mm:ss a')
                                    }
                                />
                            </Table>
*/
