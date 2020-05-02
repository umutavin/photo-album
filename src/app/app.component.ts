import { Component, OnInit, Inject } from '@angular/core';
import { BucketService } from './services/bucket.service';
import { DynamoDBService } from './services/dynamodb.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFiles: FileList;
  folderName: string;
  tableName: string;
  isEncryptionEnabled = false;
  isVersioningEnabled = false;
  fileName: string;
  photoCounter: number = 1;
  images = [];
  link: string;
  file: any;
  idToBeDeleted: string;

constructor(private bucketService: BucketService, private dynamodbService: DynamoDBService, @Inject(DOCUMENT) document) { }

  ngOnInit() { 
    //this.link = this.bucketService.listAlbums();
  }

  upload() {
    const date = new Date();
    const id = Math.floor((Math.random() * 1000000) + 1).toString();
    if(this.isEncryptionEnabled){
      this.bucketService.putEncryption();
    }
    if(this.isVersioningEnabled){
      this.bucketService.putVersioning();
    }
    this.bucketService.uploadFile(this.file, this.folderName);
    //this.dynamodbService.putItem(this.fileName, this.tableName, this.photoCounter);
    this.dynamodbService.writeRecord(this.tableName, id, this.fileName, date);
  }

  onSelectedFilesChanged(event) {
    this.file = event[0];
    this.fileName = event[0].name.split('.')[0];
  }

  describeTable(){
    this.dynamodbService.createTable(this.tableName);
  }

  deleteRecord(){
    this.dynamodbService.deleteRecord(this.tableName, this.idToBeDeleted);
  }
  
}
