import { Injectable } from '@angular/core';
import { BucketConfig } from 'src/bucketconfig';
import * as AWS from "aws-sdk";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LambdaConfig } from 'src/lambdaconfig';

@Injectable({
  providedIn: 'root'
})
export class DynamoDBService {
    dynamodb = new AWS.DynamoDB({
        apiVersion: BucketConfig.apiVersion,
        region: BucketConfig.region,
        accessKeyId: BucketConfig.accessKeyId,
        secretAccessKey: BucketConfig.secretAccessKey
    });
  
    constructor(private http: HttpClient) { }

    createTable(tableName) {
      var params = {
        AttributeDefinitions: [{
          AttributeName: "Id", 
          AttributeType: "S"
        }
        ], 
        KeySchema: [
        {
          AttributeName: "Id", 
          KeyType: "HASH"
        }
        ], 
        ProvisionedThroughput: {
          ReadCapacityUnits: 5, 
          WriteCapacityUnits: 5
        }, 
        TableName: tableName
      };
      this.dynamodb.createTable(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
  
    }
  
    putItem(fileName, tableName, counter) {
      const myDate = new Date().toString();
      var params = {
        Item: {
          "Id": {
            S: counter.toString()
          },
          "Name": {
            S: fileName
          }, 
          "Date": {
            S: myDate
          }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: tableName
       };
      this.dynamodb.putItem(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
      });
    }
  
    checkIfTableExists(tableName) {
      var params = {
        TableName: tableName /* required */
      };
      this.dynamodb.waitFor('tableExists', params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
    }
    
    writeRecord(tableName, id, name, date) {
      const data = {
        "table_name": tableName,
        "id": id,
        "name": name,
        "date": date
      }
  
      return this.http.post(LambdaConfig.apiUrl, JSON.stringify(data)).subscribe(
        res => {
          console.log('success', res);
        },
        err => {
          console.log('error', err);
        }
  
      );
    }

    deleteRecord(tableName, id) {
      const httpParams = new HttpParams().set("table_name", tableName).set("id", id);
      const httpHeaders =  new HttpHeaders({
        'Content-Type':  'application/json',
      })
      const options = { headers:httpHeaders, params: httpParams };
  
      return this.http.delete(LambdaConfig.apiUrl, options).subscribe(
        res => {
          console.log('successful delete', res);
        },
        err => {
          console.log('error', err);
        }
  
      );
    }
  }
  
