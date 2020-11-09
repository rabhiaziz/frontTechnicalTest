import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileService } from 'src/app/services/files/file.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: Array<any> = [];
  newFiles: Array<any> = [];
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles() {
    this.fileService.get().subscribe((res) => {
      this.files = res.items;
    });
  }

  getChildren(data) {
    this.fileService.getById(data.href).subscribe((res) => {
      this.newFiles = res.items;
    });
  }

  downloadFile(data) {
    this.fileService.download(data._links.download.href).subscribe((res) => {
      let myBlob = new Blob([res], { type: res.type });
      saveAs(myBlob, data.name);
    }, (err) => {
      console.log(err);
    })
  }

  uploadFile(fileInput: any, folder) {
    let fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', fileData);

    this.fileService.upload(folder._links.upload.href, formData)
      .subscribe(res => {
        this.files = [];
        this.newFiles = [];
        this.getFiles();
      })
  }
}
