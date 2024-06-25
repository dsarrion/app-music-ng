import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewVideoComponent } from '../new-video/new-video.component';

@Component({
  selector: 'app-edit-video',
  standalone: true,
  imports: [NewVideoComponent],
  templateUrl: './edit-video.component.html',
  styleUrl: './edit-video.component.css'
})
export class EditVideoComponent implements OnInit{
  edit:boolean =true; 
  @Input('id') id!:number;

 constructor(private route: ActivatedRoute){}
 
 ngOnInit(): void {
 }
}
