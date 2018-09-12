import * as React from 'react';
import { connect } from 'react-redux';
import { fetchEvents } from '../../actions/userEvents';
import { State, store } from '../../store';
import { Dispatch } from 'redux';
import * as InfiniteScroll from 'react-infinite-scroll-component';
import { translate, authListener } from '../../helpers';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';

const mapStateToProps = (state: State) => ({
    events: state.events.events,
    hasMore: state.events.events.length > 0 && state.events.lastIndex != null,
});

const mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchEvents : (restart: boolean) => dispatch(fetchEvents.action({
        restart,
        rows: 20,
    }) as any),
});

type DashProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

authListener.onAuth(() => store.dispatch(fetchEvents.action({
    restart: true,
    rows:20,
}) as any));

export const Dash =
    connect(mapStateToProps, mapDispatchToProps)(
        (props: DashProps) => (<InfiniteScroll
            dataLength={props.events.length}
            next={() => props.fetchEvents(false)}
            hasMore={props.hasMore}
            loader={<h4>{translate('Loading...')}</h4>}
            endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>{translate('End of Events')}</b>
            </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={() => props.fetchEvents(true)}
            pullDownToRefresh
            pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; {translate('Pull Down to Refresh')}</h3>
            }
            releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; {translate('Release to Refresh')}</h3>
            }>
            {props.events.map(event => <Card>
                <CardImg top width="100%"
                src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                alt="Card image cap" />
                <CardBody>
                  <CardTitle>Card title</CardTitle>
                  <CardSubtitle>Card subtitle</CardSubtitle>
                  <CardText><pre>{JSON.stringify(event, null, 2)}</pre></CardText>
                </CardBody>
            </Card>)}
        </InfiniteScroll>
    ),
);
