import { Component, OnInit } from '@angular/core';
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
  id!:number;

 constructor(private route: ActivatedRoute){}
 
 ngOnInit(): void {
    // Obtener el parámetro de la URL llamado 'id'
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

 }
}
