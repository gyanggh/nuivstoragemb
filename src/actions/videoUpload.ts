import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';
import { State } from '../store';
import { S3 } from 'aws-sdk';
import { last, curry } from 'lodash';

const actionCreator = actionCreatorFactory('videoUpload');
const actionCreatorAsync = asyncFactory<State>(actionCreator);

const bucketName = 'nuistar-videostorage';

const s3 = new S3();

export const upload = actionCreatorAsync<{
    user: string;
    teacher:string;
    id:string;
    file : File;
    title: string;
}, {
    location: string;
    title: string;
}>(
    'UPLOAD_VIDEO',
    async ({ user, teacher, file, id, title }, dispatch, getState) => {
        const location = `${teacher}/${user}/${id}.${last(file.name.split('.'))}`;
        const upload = s3.upload({
            Bucket : bucketName,
            Key : location,
        });
        upload.on(
            'httpUploadProgress',
            progress => dispatch(uploadProgress(progress.loaded / progress.total)),
        );
        await upload.promise();
        return {
            location,
            title,
        };
    });

export const uploadProgress = actionCreator<[string,number]>('UPLOAD_PROGRESS');

export const uploadClear = actionCreator<string>('UPLOAD_CLEAR');

export const getVideo = curry((
    user: string,
    teacher:string,
    id:string,
    extension: string,
) => `${teacher}/${user}/${id}.${extension}`);
