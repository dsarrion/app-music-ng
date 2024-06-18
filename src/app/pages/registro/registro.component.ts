import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import Validation from './utils/validation';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../Models/userModel';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, AvatarComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit, OnDestroy {

  @Input() edit: boolean = false;
  userData?: User;
  submitted = false;
  errorMessage:string = "";
  updateMessage: string = "";
  form: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  urlImage: string = environment.apiUrlBase+'/user/avatar/';
  avatarChange: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ){ }

  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(20)]],
        surname: ['', [Validators.required, Validators.maxLength(20)]],
        nick: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
        vpass: ['', Validators.required],
        avatar: ['', Validators.maxLength(100)],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'vpass')]
      })

      // Deshabilitar campos en modo edición
      if (this.edit) {
        this.form.get('password')!.disable();
        this.form.get('vpass')!.disable();
        this.form.get('acceptTerms')!.disable();
        this.loadUserData();
      }

    if (this.edit) {
      //Recibir datos de usuario en Edicion
      this.subscriptions.add(
        this.userService.getUserData().subscribe({
          next: (userData) => {
            this.userData = userData;
            if (this.userData) {
              this.form.patchValue({
                name: this.userData.name,
                surname: this.userData.surname,
                nick: this.userData.nick,
                email: this.userData.email
              })
            }
          },
          error: (errorData) => {
            this.errorMessage = errorData;
          },
          complete: () => {
            //console.log("completadoooOO", this.userData)
          }
        })
      )
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  async onSubmit(form: void) {
    this.submitted = true;

    if (this.form.invalid) {
      this.logFormErrors();
      console.log(this.form.value);
      return;
    }

    if (!this.edit) {
      this.registerUser();
    } else {
      this.updateUser();
    }
  }

  logFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors != null) {
        console.log(`Control: ${key}, Errors:`, controlErrors);
      }
    });
  }

  loadUserData(){
    this.subscriptions.add(
      this.userService.getUserData().subscribe({
        next: (userData) => {
          this.userData = userData;
          if (this.userData) {
            this.form.patchValue({
              name: this.userData.name,
              surname: this.userData.surname,
              nick: this.userData.nick,
              email: this.userData.email
            })
          }
        },
        error: (errorData) => {
          this.errorMessage = errorData;
        },
        complete: () => {
          //console.log("completadoooOO", this.userData)
        }
      })
    )
  }

  //Formuario de Registro
  registerUser() {
    this.subscriptions.add(
      this.userService.register(this.form.value).subscribe({
        next: (userData) => {
          console.log('Usuario registrado CORRECTAMENTE');
          this.router.navigate(['/inicio']);
          this.form.reset();
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData
        },
        complete: () => {}
      })
    );
  }

  //Formulario de Update
  updateUser() {
    //Copia de valores de formulario
    const formData = {...this.form.value};
    //Eliminar avatar si no ha cambiado para no enviar null
    if(!this.avatarChange){
      delete formData.avatar;
    }
    this.subscriptions.add(
      this.userService.update(formData).subscribe({
        next: (userData) => {
          this.userService.currentUserData.next(userData.user);
          this.userData = {...this.userData, ...formData};
        },
        error: (errorData) => {
          console.error(errorData);
          this.errorMessage = errorData;
        },complete: () => {
          this.updateMessage = "Los datos se actualizaron CORRECTAMENTE";
          setTimeout ( () => {
            this.updateMessage = "";
          },5000);
          // Limpiar el campo avatar
          this.form.patchValue({ avatar: '' });
          this.avatarChange = false;
        }
      })
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarChange = true;
      this.uploadAvatar(file);
      
    }else{
      console.error("No se ha seleccionado ningun archivo")
    }
  }

  uploadAvatar(file: File){
    const formData = new FormData();
    formData.append('avatar', file);

    this.subscriptions.add(
      this.userService.uploadAvatar(formData).subscribe({
        next: (data) => {            
          this.form.value['avatar'] = data.image;
        },
        error: (errorData) => {
          console.error("Error al subir la imagen", errorData);
          this.errorMessage = errorData
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
