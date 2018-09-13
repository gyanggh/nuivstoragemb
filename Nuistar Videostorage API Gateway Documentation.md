# Nuistar Videostorage API Gateway Documentation

## Overview
This API is designed around RESTful principles, though it does not completely adhere to REST, of which a summary can be found [here](https://www.restapitutorial.com/lessons/whatisrest.html). Clients must pass a header called Authorization, containing a jwt of their AWS cognito session. The API automatically authenticates the user from this token.
Unless otherwise specified, arguements are given as JSON key-value pairs, and results are returned as a JSON object.

## Video Operations

### /video/{id}
#### GET
This gets the information in the database about the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for video with given id.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message

#### DELETE
This deletes the information in the database about the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for video that was deleted.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message

#### POST
This updates the information in the database about the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- record
    - New values to update record with as JSON string
    - Request body

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for video that was modified.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

#### OPTIONS
Used for CORS Preflight checks, has no effects

### /video/new
#### POST
This creates a new video record.

##### Args
- record
    - Values of record with as JSON string
    - Request body

#### OPTIONS
Used for CORS Preflight checks, has no effects

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for video that was created (including ID).
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

### /getVideos
#### GET
Fetches all videos a given user has access to.

##### Args
- None

#### OPTIONS
Used for CORS Preflight checks, has no effects

##### Returns
- HTTP Code 200 (OK)
    - JSON array listing all the video records for which this user can access.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

## Comment Operations

### /video/{id}/comment/{commentId}
#### GET
This gets the information in the database about the comment with id {commentId} on the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- commentId
    - Id of comment
    - Parameter as part of path

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for comment with given id.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message

#### DELETE
This deletes the information in the database about the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- commentId
    - Id of comment
    - Parameter as part of path

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for comment that was deleted.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message

#### POST
This updates the information in the database about the video with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- commentId
    - Id of comment
    - Parameter as part of path
- comment
    - New values to update comment with as JSON string
    - Request body

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the data for comment that was modified.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

#### OPTIONS
Used for CORS Preflight checks, has no effects

### /video/{id}/comment/new
#### POST
This creates a comment on the video record with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- comment
    - Values of comment as JSON string
    - Request body

#### OPTIONS
Used for CORS Preflight checks, has no effects

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the video with the created comment (including ID).
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

### /video/{id}/comment/new
#### POST
This creates a comment on the video record with id {id}.

##### Args
- id
    - Id of record
    - Parameter as part of path
- comment
    - Values of comment as JSON string
    - Request body

#### OPTIONS
Used for CORS Preflight checks, has no effects

##### Returns
- HTTP Code 200 (OK)
    - JSON object represnting the video with the created comment (including ID).
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

## Miscellaneous

### /getEvents
#### GET
Fetches all events a given user has access to.
Note: Currently will only ever return an empty array.

##### Args
- None

#### OPTIONS
Used for CORS Preflight checks, has no effects

##### Returns
- HTTP Code 200 (OK)
    - JSON array listing all the events for which this user can access.
- HTTP Code 400 (Error)
    - String with a potentially helpful error message.

### /requestFormat
#### POST
This requests that the backend transcode the given video to a given file format.
Note: Currently a No-op

##### Args
- id
    - Id of record
    - Request body

## S3

### /{Teacher}/{User}/{ID}.{format}
Describes the canonical location of a media file with given teacher id, user id, video id, and video format.
See S3 documentation for more details.

#### GET
Gets this video, allowing for download and consumption
##### POST/PUT
Uploads a video to this location.
##### DELETE
Deletes this video file.
##### OPTIONS
Used for CORS Preflight headers
