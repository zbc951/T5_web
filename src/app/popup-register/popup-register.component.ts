import { UtilService } from './../app-service/util.service';
import { MemberService } from './../app-service/member.service';
import { PublicService } from './../app-service/public.service';
import { ToastService } from './../app-service/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LangService } from './../app-service/lang.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';

enum registerStat {
  form,
  success
}

@Component({
  selector: 'app-popup-register',
  templateUrl: './popup-register.component.html',
  // styleUrls: ['./popup-register.component.scss']
})
export class PopupRegisterComponent implements OnInit {

  accountPattern = new RegExp(/^[0-9a-zA-Z]*[a-zA-Z]+[0-9a-zA-Z]*$/);
  passwordPattern = new RegExp(/^[0-9a-zA-Z\@\.\_\$\#\%\^\&\*\+\-]+$/);

  registerForm = new FormGroup({
    account: new FormControl('',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(/^[0-9a-zA-Z]*[a-zA-Z]+[0-9a-zA-Z]*$/)
      ]
    ),
    password: new FormControl('',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(/^[0-9a-zA-Z\@\.\_\$\#\%\^\&\*\+\-]+$/)
      ]
    ),
    checkPassword: new FormControl(''),
    phone: new FormControl(''),
    smsCode: new FormControl(''),
    code: new FormControl(''),
    isCheck: new FormControl(''),
  });

  translations;
  isPassword = true;
  inputType = 'password';
  isPhoneConfirm = false;
  placeholder = {
    account: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    smsCode: '',
    invitationCode: ''
  };

  invalidErrors = {
    code: '',
    account: '',
    password: '',
    checkPassword: '',
    phone: '',
    smsCode: ''
  };


  accountInvalid;
  passwordInvalid;
  chkPasswordInvalid;
  lengthInvalid;



  AppRoutes = AppRoutes;
  registerStat = registerStat;

  status = registerStat.form;
  // status = registerStat.success;

  isInvit = false;
  tmpInvitation;

  constructor(
    private langService: LangService,
    private router: Router,
    private toastService: ToastService,
    private publicService: PublicService,
    private memberService: MemberService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.setTxt(this.langService.translations);
        }
      });

    this.registerForm.controls.phone
      .valueChanges
      .subscribe((phone) => {

        // console.log('phone', phone);
        this.invalidErrors.phone = (phone.length == 10) ? '' : this.translations.REGISTER.INVALID.PHONE_NUM_LIMIT;

      });


    this.registerForm.controls.account
      .valueChanges
      .subscribe((input) => {


        if (input.length == 0) {
          this.invalidErrors.account = '';
          return;
        }


        if (this.accountPattern.test(input)) {

          this.invalidErrors.account = '';

          if (!(input.length > 5 && input.length < 31)) {

            this.invalidErrors.account = this.lengthInvalid;

          } else {

            this.invalidErrors.account = '';

          }


        } else {

          this.invalidErrors.account = this.accountInvalid;
        }
      });

    this.registerForm.controls.password
      .valueChanges
      .subscribe((input) => {

        if (!input) {

          this.invalidErrors.password = '';
          return;
        }

        if (this.passwordPattern.test(input)) {

          this.invalidErrors.password = '';

          if (!(input.length > 5 && input.length < 31)) {

            this.invalidErrors.password = this.lengthInvalid;

          } else {

            this.invalidErrors.password = '';

          }

        } else {

          this.invalidErrors.password = this.passwordInvalid;
        }
      });

    this.registerForm.controls.checkPassword
      .valueChanges
      .subscribe((input) => {

        // console.log('input', input);
        const p = this.registerForm.value.password;
        // console.log('p', p, input);

        if (input == p) {

          this.invalidErrors.checkPassword = '';

        } else {
          this.invalidErrors.checkPassword = this.chkPasswordInvalid;
        }
      });



  }

  ngOnInit(): void {

    this.isInvit = false;

    const code = UtilService.getParameterByName('code', this.router.url);
    const invitation = UtilService.getParameterByName('invitation', this.router.url);

    // console.log('code', code, 'invitation', invitation);

    if (code) {
      this.isInvit = true;
      this.registerForm.patchValue({ code: code });
    }

    if (invitation) {
      this.tmpInvitation = invitation;
    }


  }

  close(): void {
    // this.router.navigate([{ outlets: { popup: null } }]);
  }

  setTxt(translations: any): void {
    this.translations = translations;

    this.accountInvalid = this.translations.REGISTER.INVALID.ACCOUNT;
    this.passwordInvalid = this.translations.REGISTER.INVALID.PASSWORD;
    this.chkPasswordInvalid = this.translations.REGISTER.ERR.CONFIRM;
    this.lengthInvalid = this.translations.REGISTER.INVALID.LENGTH;

    this.placeholder = {
      account: this.langService.translations.REGISTER.ACCOUNT,
      password: this.langService.translations.REGISTER.PWD,
      passwordConfirm: this.langService.translations.REGISTER.CONFIRM,
      phone: this.langService.translations.REGISTER.PHONE,
      smsCode: this.langService.translations.REGISTER.PHONE_CONFIRM,
      // phoneConfirm: this.langService.translations.REGISTER.PHONE_CONFIRM,
      invitationCode: this.langService.translations.REGISTER.CODE
    }
  }

  passwordChange(type: boolean): void {
    this.isPassword = type;
    if (this.isPassword) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }


  getSmsCode(): void {
    this.publicService.bindPhone({ phone: this.registerForm.value.phone })
      .subscribe(
        () => {
          this.isPhoneConfirm = true;
        },
        ({ error }) => {
          // console.log(error);
          this.toastService.error(error.message);
        });

    // this.isBindPhoneLock = true;
    // this.isPhoneConfirm = true;

    // setTimeout(() => {
    //   this.isBindPhoneLock = false;

    // }, 1000 * 60);

  }

  // startCount(): void {
  //   this.status = registerStat.success;
  // }

  async goPage(path: string) {
    if (path[0] != '/') {
      path = '/' + path;
    }
    const opener = window.opener;
    if (opener !== null) {
      opener.postMessage({ success: true, path: path }, opener.location.origin);
      setTimeout(() => window.close(), 500);
    } else {
      await this.publicService.init();
      this.router.navigateByUrl(path);
    }
  }

  register(form: FormGroup): void {

    // console.log('valid', form.valid);

    // tslint:disable-next-line: forin
    for (const key in this.invalidErrors) {
      this.invalidErrors[key] = '';
    }

    if (form.controls.isCheck.invalid) {
      // this.toastService.error(this.CHECK_POLICY_txt, 3000);
      this.toastService.error(this.langService.translations.REGISTER.INVALID.CHECK_POLICY);
      return;
    }

    if (form.value.password !== form.value.checkPassword) {
      // this.invalidErrors.checkPassword = this.CONFIRM_PWD_txt;

      // console.log('**', this.placeholder.passwordConfirm);

      this.invalidErrors.checkPassword = this.chkPasswordInvalid;
      return;
    }

    // if (form.value.phone.length != 10) {
    //   // this.invalidErrors.checkPassword = this.CONFIRM_PWD_txt;
    //   this.invalidErrors.phone = this.translations.REGISTER.INVALID.PHONE_NUM_LIMIT;
    //   return;
    // }

    const copy = Object.assign({}, form.value);
    delete copy.confirm;
    delete copy.isCheck;

    // console.log('copy', copy);

    if (this.tmpInvitation) {
      copy.invitation = this.tmpInvitation
    }

    this.publicService.register(copy)
      .subscribe(
        (res) => {

          if (res.data.review) {

            this.toastService.forceAlert(this.langService.translations.REGISTER.WAIT, () => {
              // this.router.navigateByUrl(AppRoutes.HOME);
              if (window.opener !== null) {
                window.close();
              } else {
                this.router.navigateByUrl(AppRoutes.HOME);
              }

            });

          } else {

            // this.publicService.init();
            // this.startCount();
            this.status = registerStat.success;

          }


        },
        (err) => {

          console.log('err', err);

          if (err.error.errors) {

            Object.assign(this.invalidErrors, err.error.errors);

          } else {


            if (err.error.message === 'multiple invitation_code') {

              this.toastService.error(this.langService.translations.SERVER_ERROR);

            } else {

              this.toastService.error(err.error.message, 3000);
            }


          }

        },

        () => {
          // got, it happens after succeed
          // console.log('final');
          // this.registerForm.reset();
        }
      ).add(() => {
        // console.log('final');
        // this.registerForm.reset();

      });

  }

  readPolicy(): void {

    const txt = this.langService.translations.ABOUT.TERMS.CNT;

    this.toastService.policy(txt, () => {
      this.registerForm.controls.isCheck.patchValue(true);
    });

  }

}
