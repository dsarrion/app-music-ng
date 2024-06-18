import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Track } from '../../Models/trackModel';
import { TracksService } from '../../services/tracks/tracks.service';
import { ContentComponent } from '../../components/content/content.component';
import {YouTubePlayerModule } from '@angular/youtube-player';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Subscription, filter, switchMap } from 'rxjs';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { UnlikeComponent } from '../../components/icon/unlike/unlike.component';
import { LikeComponent } from '../../components/icon/like/like.component';
import { CommentsComponent } from '../../components/icon/comments/comments.component';
import { ShareComponent } from '../../components/icon/share/share.component';
import { CommentsService } from '../../services/comments/comments.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AvatarIconComponent } from '../../components/avatar-icon/avatar-icon.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule , ContentComponent, YouTubePlayerModule, RouterLink, UnlikeComponent, LikeComponent, CommentsComponent, ShareComponent, AvatarComponent, AvatarIconComponent, ReactiveFormsModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('id') idVideo?: string;
  userLoginOn: boolean = false;
  userId?: number;
  submitted: boolean = false;
  video!: Track;
  idVideoYT!: any;
  idCategory!: string;
  category!:CategoryModel;
  categoryBest:CategoryModel;
  errorMessage: string = "";
  comments: { content: string, user_avatar: string, user_nick:string }[] = [];
  avatarUserComment: string | null = null;
  showComments: boolean = false;
  countComments: number = 0;
  form: FormGroup = new FormGroup({});
  private subscriptions: Subscription = new Subscription(); 

  @ViewChild('demoYouTubePlayer') demoYouTubePlayer!: ElementRef<HTMLDivElement>;
      videoWidth: number | undefined;
      videoHeight: number | undefined;
 
  constructor(private trackService: TracksService,
              private userService: UserService,
              private commentService: CommentsService, 
              private _changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private viewportScroller: ViewportScroller,
              private formBuilder: FormBuilder
            ) { 
    this.categoryBest = {
      'id': 3,
      'name': 'Recomendados'
    }
  }

  ngOnInit(): void {
    //Comprobar si el usuario esta logeado y sacar datos
    this.getUserloginOn();

    // Suscribirse a los cambios del parametro id
    this.subscriptions.add(
      this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.idVideo = id;
          this.getVideo(this.idVideo);
          this.getCommentsbyVideo(Number(id));
          // Desplazar la página hacia arriba
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      })
    );

    this.initializeForm();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.demoYouTubePlayer) {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    }
  }

  // Inicializar formulario
  initializeForm() {
    this.form = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(120), Validators.minLength(3)]],
      user_id: [''],
      track_id: [Number(this.idVideo)]
    });
  }

  //Obtener video para mostrar
  async getVideo(idVideo:string){
    this.subscriptions.add(
      await this.trackService.getTrack(idVideo).subscribe({
        next: (track) => {
          this.video = track.data;
          //recoger id de video desde url de YT
          this.idVideoYT = this.extractVideoId(this.video.url);
          //Recoger id de categoria de video
          this.idCategory = this.video.category_id.toString();
          //Obtener categoria del video (objeto)
          this.getCategory(this.idCategory);
        },
        error: (errorData) => {
          console.error(errorData)
          this.errorMessage = errorData
        }
      })
    ) 
  }

  //Obtener categoria del video para mostrar
  async getCategory(id:string){
    await this.subscriptions.add(
      this.trackService.getCategory(id).subscribe({
        next: (category) => {
          this.category = category.data;
        },
        error: (errorData) =>{
          console.error(errorData);
          this.errorMessage = errorData
        }  
      })
    )
  }

  getUserloginOn(){
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (loginOn) => {
          this.userLoginOn = loginOn;
          //console.log('Usuario logueado:',this.userLoginOn);
          if(this.userLoginOn){
            this.getUserData();
          }  
        },
        error: (errorData) => {
          console.error('Error al verificar el estado de login:',errorData)
        }
      })
    )
  }

  getUserData(){
    this.subscriptions.add(
      this.userService.currentUserData.subscribe({
        next: (dataUser) => {
          this.userId = dataUser?.id;
          if(this.userId){
            this.form.patchValue({ user_id: this.userId }); //Actualizar el formulario con el id del usuario
          }
          //console.log('Datos del usuario:', dataUser);
        },
        error: (errorData) => {
          console.error(errorData)
        }
      })
    )
  }

  /* //Obtener si usuario esta registrado y id de usuario
  getUserloginOn(){
    this.subscriptions.add(
      this.userService.currentUserLoginOn.pipe(
        filter((loginOn: boolean) => loginOn),
        switchMap(() => this.userService.currentUserData)
      )
      .subscribe({
        next: (dataUser) => {
          this.userId = dataUser?.id;
          if(this.userId){
            this.form.patchValue({ user_id: this.userId }); //Actualizar el formulario con el id del usuario
          } 
        },
        error: (errorData) => {
          console.error(errorData)
        }
      })
    )
  } */

  //Obtener comentarios del video
  getCommentsbyVideo(id:number){
    this.subscriptions.add(
      this.commentService.getCommentsByVideo(id).subscribe({
        next: (data) => {
          this.comments = data.map((comment: { content: string, user_avatar:string, user_nick:string }) => ({
            content: comment.content,
            user_avatar: comment.user_avatar,
            user_nick: comment.user_nick
          }));     
          this.countComments = data.length;
          //console.log(data);
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
        }
      })
    )
  }
  //Envio de comentarios
  sentComment(){
    this.subscriptions.add(
      this.commentService.createComment(this.form.value).subscribe({
        next: (data)=> {
          console.log('Mensaje enviado CORRECTAMENTE');
          this.form.reset();
          this.submitted = false;
          this.getCommentsbyVideo(Number(this.idVideo));        
        }, 
        error: (erroData) => {
          console.error(erroData);
        }
      })
    )
  }

  //mostrar o ocultar comentarios
  toggleComments() {
    this.showComments = !this.showComments;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  async onSubmit(form: void) {
    this.submitted = true;

    if (this.form.invalid) {
      this.logFormErrors();
      return;
    }

    this.sentComment();
  }

  logFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors != null) {
        console.log(`Control: ${key}, Errors:`, controlErrors);
      }
    });
  }

  onResize = (): void => {
    if (typeof window !== 'undefined' && this.demoYouTubePlayer) {
      // Automáticamente expandir el video para ajustar la página hasta 1200px x 720px
      this.videoWidth = Math.min(this.demoYouTubePlayer.nativeElement.clientWidth, 1200);
      this.videoHeight = this.videoWidth * 0.6;
      this._changeDetectorRef.detectChanges();
    }
  }

  //extraer id de YT desde url
  extractVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }
}