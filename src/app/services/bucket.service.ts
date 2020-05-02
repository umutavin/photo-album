import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { BucketConfig } from 'src/bucketconfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BucketService {

  bucket = new S3({
    accessKeyId: BucketConfig.accessKeyId,
    secretAccessKey: BucketConfig.secretAccessKey,
    region: BucketConfig.region
  });

  constructor() { }

  getUploadParams(file, folder?) {
    const params = { 
      Bucket: BucketConfig.bucketName,
      Key: folder + '/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    }
    return params;
  }

  getEncryptionParams() {
    const params = { 
      Bucket: BucketConfig.bucketName, /* required */
      ServerSideEncryptionConfiguration: {
        Rules: [ 
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: BucketConfig.sseAlgorithm
            }
          }
        ]
      },
    }
    return params;
  }

  getVersioningParams() {
    const params = { 
      Bucket: BucketConfig.bucketName,
      VersioningConfiguration: {
        Status: 'Enabled'
      }
    }
    return params;
  }

  uploadFile(file, folder) {
    const params = this.getUploadParams(file, folder);
    this.bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  putEncryption() {
    const params = this.getEncryptionParams();
    this.bucket.putBucketEncryption(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
  }

  putVersioning() {
    const params = this.getVersioningParams();
    this.bucket.putBucketVersioning(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
  }

  listAlbums(){
    let apiUrl = this.bucket.endpoint.href + BucketConfig.bucketName;
    let imageUrl: string;
    const params = {
      Bucket: BucketConfig.bucketName,
      Delimiter: '/',
      Prefix: 'kak/', 
      MaxKeys: 10
     };
    this.bucket.listObjects(params, function(err, data) {
      if (err) {
        return alert("There was an error viewing your album: " + err.message);
      }
    });
    return imageUrl;
  }
}
