import * as React from 'react';
import { connect } from 'react-redux';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
Progress, Alert } from 'reactstrap';
import { uploadClear } from '../../actions/videoUpload';
import { State } from '../../store';
import { createSelector } from 'reselect';
import { translate } from '../../helpers';

const mapStateToProps = createSelector(
    (state: State) => state.uploads,
    (uploads) => {
        const uploadsList = uploads.order.map(id => ({ id, ...uploads.uploads[id] }));
        return {
            uploading: uploadsList.filter(upload => !upload.done),
            done: uploadsList.filter(upload => upload.done),
        };
    },
);

const mapDispatchToProps = {
    uploadClear,
};

type UploadIndicatorProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export const UploadIndicator =
connect(mapStateToProps, mapDispatchToProps)((props: UploadIndicatorProps) => (<>
    {props.uploading.length > 0 ? <div style={{
        position:'fixed',
        right:0,
        bottom:0,
    }}>
        <UncontrolledDropdown direction="up">
            <DropdownToggle caret>
                {translate('Upload Progress')}
            </DropdownToggle>
            <DropdownMenu right>
                {props.uploading.map(upload =>
                    <div key={upload.id} style={{
                        width:'25vw',
                    }}>
                        <DropdownItem >
                            <div className="text-center">{upload.title}</div>
                            <Progress value={upload.progress} max={1} animated/>
                        </DropdownItem>
                    </div>,
                )}
            </DropdownMenu>
        </UncontrolledDropdown>
    </div> : null}
    {props.done.length > 0 ?
        <div style={{
            width:'25vw',
            position:'fixed',
            right:'5vw',
            top:'10vw',
        }}>
            {props.done.map(done =>
                <Alert key={done.id}
                    color="success"
                    isOpen={true}
                    toggle={() => props.uploadClear(done.id)}>
                    {`${translate('Video')} ${done.title} ${translate('Finished Uploading')}` }
                </Alert>,
            )}
        </div>
    : null}
</>));
