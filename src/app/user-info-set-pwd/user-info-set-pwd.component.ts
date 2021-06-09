import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { AuthService } from './../app-service/auth.service';
import { MemberService } from '../app-service/member.service';
import { PublicService } from '../app-service/public.service';
import { AppRoutes } from '../constant/routes';

@Component({
  selector: 'app-user-info-set-pwd',
  templateUrl: './user-info-set-pwd.component.html',
  // styleUrls: ['./user-info-set-pwd.component.scss']
})
export class UserInfoSetPwdComponent implements OnInit {
  private user;
  form;

  pwdvalidErrors = {
    confirmPassword: '',
    newPassword: '',
    oldPassword: ''
  };

  @Output() closeEvt = new EventEmitter();

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private toastService: ToastService,
    private langService: LangService,
    private publicSerivice: PublicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.auth.user;

    this.form = this.formBuilder
      .group({
        confirmPassword: '',
        newPassword: '',
        oldPassword: ''
      });
  }

  changePwd(form: FormGroup): void {


    console.log('changePwd', this.form.value);


    this.pwdvalidErrors = {
      confirmPassword: '',
      newPassword: '',
      oldPassword: '',
    };


    if (form.value.oldPassword === form.value.newPassword) {


      this.toastService.error(this.langService.translations.MEMBER_INFO.unchanged);
      return;

    }


    if (form.value.newPassword !== form.value.confirmPassword) {

      console.log('****', this.langService.translations);
      // this.pwdvalidErrors.confirmPassword = this.pwdInvalidMsg.CONFIRM_PWD_FAIL;
      this.pwdvalidErrors.confirmPassword = this.langService.translations.MEMBER_INFO.CONFIRM_PWD_FAIL;

      console.log('**', this.pwdvalidErrors);
      return;
    }

    this.memberService.changePassword(form.value)
      .subscribe(
        (res) => {
          // this.toastService.error(this.pwdInvalidMsg.PWD_CHANGED, 3000);
          this.form.reset();
          this.close();
          this.toastService.error(this.langService.translations.MEMBER_INFO.PWD_CHANGED, 3000);

          this.publicSerivice.logout()
            .subscribe((res) => {
              // console.log('res', res);
              this.router.navigateByUrl(AppRoutes.HOME);
            });
        },
        (err) => {

          // console.log(err);
          if (err.error.errors) {
            Object.assign(this.pwdvalidErrors, err.error.errors);
            // console.log('this.pwdvalidErrors', this.pwdvalidErrors);

          } else {

            /** todo 確認一下什麼時候會有這種*/
            this.toastService.error(err.error.data.message, 3000);
          }

        });
  }


  close(): void {
    this.closeEvt.emit();
  }

}
