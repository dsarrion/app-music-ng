import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TracksService } from '../../../../services/tracks/tracks.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Track } from '../../../../Models/trackModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-video',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-video.component.html',
  styleUrl: './new-video.component.css'
})
export class NewVideoComponent implements OnInit, OnDestroy {

  categories?: any;
  track?: Track;
  errorMessage: string = "";
  @Input() edit:boolean = false;
  @Input() idTrack?: number;
  submitted:boolean = false;
  form: FormGroup = new FormGroup({});
  private subscriptions: Subscription = new Subscription();

  constructor(
    private trackService: TracksService, 
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.getCategories();

    this.form = this.formBuilder.group(
      {
        category_id: ['', Validators.required],
        title: ['', Validators.required],
        dj: ['', Validators.required],
        description: ['', Validators.required],
        url: ['', Validators.required]    
      }
    )

    if (this.edit && this.idTrack) { 
      //Recibir datos del video
      this.subscriptions.add(
        this.trackService.getTrack(this.idTrack).subscribe({
          next: (trackData) => {
            this.track = trackData.data;
            if (this.track) {
              this.form.patchValue({
                category_id: this.track.category_id,
                title: this.track.title,
                dj: this.track.dj,
                description: this.track.description,
                url: this.track.url
              })
            }
          },
          error: (errorData) => {
            this.errorMessage = errorData;
          },
          complete: () => {
            //console.log("completadoooOO", this.track)
          }
        })
      )  
    }

  }

  getCategories(){
    this.subscriptions.add(
      this.trackService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData;
        }
      })
    )
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(){
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if(!this.edit){
      // Nuevo Video
      if(this.form.valid){
        this.subscriptions.add(
          this.trackService.createVideo(this.form.value).subscribe({
            next: (data) => {
              console.log("Sesión subida CORRECTAMENTE")
            },
            error: (errorData) => {
              console.log(errorData);
              this.errorMessage = errorData;
            },
            complete: () => {
              this.router.navigate(['/inicio']);
              this.form.reset();
            }
          })
        )  
      }else{
        return;
      }
    }else{
      // Actualizar video
      if(this.form.valid && this.idTrack){
        this.subscriptions.add(
          this.trackService.updateTrack(this.form.value, this.idTrack).subscribe({
            next: (data) => {
              console.log("Sesión actualizada CORRECTAMENTE")
            },
            error: (errorData) => {
              console.log(errorData);
              this.errorMessage = errorData;
            },
            complete: () => {
              this.router.navigate(['/all_videos']);
              this.form.reset();
            }
          })
        ) 
      }else{
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
