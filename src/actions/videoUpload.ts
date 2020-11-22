import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { State } from '../store';
import { S3 } from 'aws-sdk';
import { last } from 'lodash';
import { Record } from '../reducers/videoRecords';
import { Auth } from 'aws-amplify';
import { authListener } from '../helpers';

const actionCreator = actionCreatorFactory('videoUpload');
const actionCreatorAsync = asyncFactory<State>(actionCreator);

const bucketName = 'nuistar-videostorage';

let s3 = new S3();

const user:any = async () => await Auth.currentUserInfo();

authListener.onAuth(async () => s3 = new S3({
    credentials: user ? await Auth.currentUserCredentials() : '',
    region: 'us-west-2',
}));

export const upload = actionCreatorAsync<{
    user: string;
    teacher:string;
    id:string;
    file : File;
    title: string;
}, {
    location: string;
    id:string;
}>(
    'UPLOAD_VIDEO',
    async ({ user, teacher, file, id }, dispatch, getState) => {
        const location = `${teacher}/${user}/${id}.${last(file.name.split('.'))}`;
        const upload = s3.upload({
            Bucket : bucketName,
            Body: file,
            Key : location,
        });
        upload.on(
            'httpUploadProgress',
            progress => dispatch(uploadProgress([id, progress.loaded / progress.total])),
        );
        await upload.promise();
        return {
            location,
            id,
        };
    });

export const uploadProgress = actionCreator<[string, number]>('UPLOAD_PROGRESS');

export const uploadClear = actionCreator<string>('UPLOAD_CLEAR');

export const getVideo = ({
    user,
    teacher,
    id,
    formats,
    /* tslint:disable-next-line */
} : Record) => `https://d39rj774o1qwc0.cloudfront.net/${teacher}/${user}/${id}.${prefer(['mp4'], formats)}`;

const prefer = (prefs : string[], available : string[]) =>
    require(prefs, available) || available[0];

const require = (prefs : string[] = [], available : string[] = []) =>
    prefs.filter(pref => available.indexOf(pref) > -1)[0];
