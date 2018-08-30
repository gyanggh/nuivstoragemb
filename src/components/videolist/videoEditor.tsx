import * as React from 'react';
import { RecordTags, RecordSubmitted, Record } from '../../reducers/videoRecords';
import { Button, FormGroup, Label, Input, Col } from 'reactstrap';
import { translate } from '../../helpers';

const PairRenderer = (props : {
    keyValue: string;
    value: string;
    onChange: (vals : [string, string]) => void;
    remove : () => void;
}) => (<FormGroup row className="border border-rounded p-2 mx-2 my-0">
    <Col md={5}>
        <Input type="text" placeholder={translate('Key')} value={props.keyValue}
        onChange={ev => props.onChange([ev.target.value, props.value])} />
    </Col>
    <Col md={5}>
        <Input type="text" placeholder={translate('Value')} value={props.value}
        onChange={ev => props.onChange([props.keyValue, ev.target.value])} />
    </Col>
    <Col md={2}>
        <Button color="danger" onClick={props.remove}>{translate('Delete')}</Button>
    </Col>
</FormGroup>);

export class VideoTagsEditor extends React.Component<{
    record : RecordTags;
}, {
    tags: {
        keyValue: string;
        value : string;
        key : number;
    }[];
    keyIndex:number;
}>{
    constructor(props : any) {
        super(props);
        const keys = Object.keys(props.record);
        if (keys.length > 0) {
            this.state = {
                tags : keys.map((key, index) => ({
                    keyValue : key,
                    value : props.record[key],
                    key: index,
                })),
                keyIndex : keys.length,
            };
        } else {
            this.state = {
                tags: [{
                    keyValue : '',
                    value : '',
                    key : 0,
                }],
                keyIndex : 1,
            };
        }
    }

    render() {
        return(<div className="my-4">
            {this.state.tags.map(
                tag => <PairRenderer
                    {...tag}
                    onChange={([keyValue, value]) => this.setState({
                        ...this.state,
                        tags : this.state.tags.map(innerTag => innerTag.key === tag.key ? {
                            keyValue,
                            value,
                            key:tag.key,
                        } : innerTag),
                    })}
                    remove={() => this.setState({
                        ...this.state,
                        tags: this.state.tags.filter(innerTag => innerTag.key !== tag.key),
                    })}
                    />,
            )}
            <Button color="success" className="mt-3" onClick={() => this.setState({
                ...this.state,
                tags:[...this.state.tags, {
                    keyValue:'',
                    value:'',
                    key : this.state.keyIndex,
                }],
                keyIndex : this.state.keyIndex + 1,
            })}>{translate('Add Tag')} </Button>,
        </div>);
    }
    public getTags() : RecordTags {
        const obj = {};
        for (const bit of this.state.tags.filter(
            item => item.keyValue !== '' || item.value !== '' ,
        )) obj[bit.keyValue] = bit.value;
        return obj;
    }
}

export const NewRecord = (
    { submit, cancel } : { submit : (a : RecordSubmitted) => void, cancel : () => void },
) => {
    const tagsRef = React.createRef<VideoTagsEditor>();
    return (<div className="border rounded m-3 p-5">
            <h2> {translate('Add New Video')} </h2>
            <FormGroup>
              <Label for="videoFile">{translate('Video File')}</Label>
          {/* TODO: Custom styling for this file input for prettinesssss */}
              <Input type="file" id="videoFile" name="videoFile"
              placeholder={translate('Video')} />
            </FormGroup>
            <h3> Tags </h3>
            <VideoTagsEditor ref={tagsRef} record={{}}/>
            <FormGroup inline>
                <Button color="primary" onClick={() => {
                    submit({
                        tags: tagsRef.current ? tagsRef.current.getTags() : {} ,
                    });
                    console.log({
                        tags: tagsRef.current ? tagsRef.current.getTags() : {} ,
                    });
                }}>{translate('Submit')}</Button>
                <Button color="danger" onClick={cancel}>{translate('Cancel')}</Button>
            </FormGroup>
        </div>
    );
};

export const EditRecord = ({ record, submit, cancel } :
    { record: Record; submit : (a : RecordSubmitted) => void, cancel : () => void }) => {
    const tagsRef = React.createRef<VideoTagsEditor>();
    return (<div className="border rounded">
            <h2> {translate('Video')} </h2>

            <h3> {translate('Tags')} </h3>
            <VideoTagsEditor ref={tagsRef} record={record.tags}/>
            <FormGroup inline>
                <Button color="primary" onClick={() => submit({
                    ...record,
                    tags: tagsRef.current ? tagsRef.current.getTags() : {} ,
                })}>{translate('Submit')}</Button>
                <Button color="danger" onClick={cancel}>{translate('Cancel')}</Button>
            </FormGroup>
        </div>
    );
};