import { Router } from '@angular/router';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { DayjsService } from './../app-service/dayjs.service';
import { DepositService, DepositReviewStatus } from './../app-service/deposit.service';
import { MemberService, IMoneyLimit } from './../app-service/member.service';
import { BankService } from './../app-service/bank.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DecimalPipe
} from '@angular/common';
import { PublicService } from './../app-service/public.service';
import { ReviewService } from './../app-service/review.service';

import { AppRoutes } from '../constant/routes';


const inputTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

enum tabs {
  bank,
  market,
  atm
}

enum bankpage {
  form,
  review
}

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  // styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  AppRoutes = AppRoutes;

  tabs = tabs;
  bankpage = bankpage;
  currentType = tabs.bank;

  // for right side small board
  sideBoardType = 'deposit';
  // bankStatus = 0;
  bankStatus = bankpage.form;

  limit;
  limitTxt = '';
  banks = [];

  form: FormGroup;
  tid_ctrl: FormControl;
  tail_code;

  bankinfo = {
    id: null,
    money: null,
    applyAmount: null,
    payeeName: null,
    payeeAccount: null,
    payeeBankName: null,
    payeeBranchName: null,
    remarkTransactionId: null,
    remarkTransactionAt: null,
    status: null,
  };

  depositInvalidErr = {
    money: '',
    transactionAt: '',
    transactionId: '',
    status: false,
    amount: '',
    message: '',
  };

  reviewStatus = DepositReviewStatus;
  thirdPaymentsMenu = [];

  thirdForm: FormGroup;
  isThirdPay = false;
  selectedThirdpay;
  selectedPayment;
  payments = [];
  paymentsAmounts = null;
  // thirdAmount = 0;
  thirdMin = 0;
  thirdMax = 0;

  isHaveBank = false;

  // 不能存轉提
  locked = false;
  tmpForm;

  tmpMoneyval;
  $review;

  constructor(
    private bankService: BankService,
    private depositService: DepositService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private toast: ToastService,
    private decimalPipe: DecimalPipe,
    private langService: LangService,
    private router: Router,
    public publicService: PublicService,
    public reviewService: ReviewService,
  ) {

    // 監聽存款審核通過
    this.$review = this.reviewService.getReviewApproved().subscribe((res: any) => {
      // console.log('getReviewApproved res', res);
      if (res.reviewTypeKey === "deposit") {
        this.ngOnInit();
        this.bankStatus = bankpage.form;
        // this.form.get('money').patchValue(this.limit.depositMinPer);
      }
    })
  }

  ngOnInit(): void {
    this.bankService.getApiIsHaveBank()
      .subscribe((res) => {
        // console.log('getApiIsHaveBank', res);
        this.isHaveBank = res.isHaveBank;

        this.init();

      });

    this.form = this.formBuilder
      .group({
        id: 0,
        transactionAt: new FormControl({ value: '', disabled: true }, Validators.required),
        transactionId: new FormControl({ value: '', disabled: true }, Validators.required),
        money: new FormControl({ value: null, disabled: true }, Validators.required)
      });

    this.thirdForm = this.formBuilder
      .group({
        selectIdx: 0,
        // paymentId: '',
        amount: ''
      });

    this.thirdForm.controls.selectIdx
      .valueChanges
      .subscribe((val) => {

        // console.log('paymentId valueChanges', val, typeof val);
        this.changepayments(val);

      });

    this.memberService.getLimit()
      .subscribe((limit: IMoneyLimit) => {
        this.limit = limit;

        // if (this.bankinfo.status !== 'review') {
        //   this.form.get('money').patchValue(this.limit.depositMinPer);
        // }

      });

    this.tid_ctrl = this.form.get('transactionId') as FormControl;
    this.tid_ctrl.valueChanges
      .subscribe((val) => {

        // console.log('val', val);

        const bank = this.banks.find((bank) => {

          return bank.account == val;

        });

        if (bank) {
          // console.log('bank', bank);
          this.tail_code = bank.codeParse;
        }
      });
  }

  init() {

    if (this.isHaveBank) {

      this.getBanks();
      this.loadLastDeposit();

    }

    this.locked = this.publicService.locked;

    if (this.locked) {
      this.form.disable();
      this.thirdForm.disable();
    }

    this.depositService.payments()
      .subscribe((res) => {
        // console.log('res', res);

        let platforms = [];
        const maps = {};

        res.data.forEach(pay => {

          const tmptype = pay.type.toLowerCase();

          if (!maps[tmptype]) {

            const display = this.getTypeDisplay(tmptype, pay.typeName);

            // console.log('display', display);

            maps[tmptype] = {
              type: tmptype,
              typeName: pay.typeName,
              typename: display.typeName,
              class: display.class,
              payments: []
            };

            platforms.push(maps[tmptype]);
          }

          platforms.filter(p => p.type == tmptype).forEach(p => {
            p.payments.push(pay);
          });

        });

        this.thirdPaymentsMenu = platforms;

        if (!this.isHaveBank) {
          this.typeOnChange(this.thirdPaymentsMenu[0].type);
        }


      });

    this.limitTxt = this.langService.translations.MEMBER_DEPOSIT.MONEY_PS1;
  }

  typeOnChange(type): void {


    // console.log('typeOnChange', type);
    this.currentType = type;

    if (this.currentType !== tabs.bank &&
      this.currentType !== tabs.market &&
      this.currentType !== tabs.atm) {


      const thirdpay = this.thirdPaymentsMenu.find((item) => {

        return item.type === this.currentType;

      });

      this.selectedThirdpay = thirdpay;
      this.payments = this.selectedThirdpay.payments;
      this.selectedPayment = this.payments[0];
      this.paymentsAmounts = this.selectedPayment.amounts;
      this.isThirdPay = true;
      this.setThirdAmountLimit();

    } else {
      this.isThirdPay = false;
    }


  }

  bankTrans(n: number): void {
    this.bankStatus = n;
  }

  getBanks(): void {
    this.bankService.banks()
      .subscribe((res: any) => {
        // console.log('banks res', res);
        this.banks = res.data;


        if (this.banks.length === 0) {

          this.toast.forceAlert(this.langService.translations.MEMBER_WITHDRAW.NO_BANK, () => {

            this.router.navigateByUrl(AppRoutes.BANK_CARD);

          });
        }

        this.banks.map((item: any) => {
          // console.log(item);
          item.codeParse = item.account.substr(item.account.length - 4);
        });

        this.tid_ctrl.patchValue(this.banks[0].account);

        // console.log(this.banks);
        // this.banksLimit = res.limit;
        // this.initCards();
      });
  }


  doComit(form) {

    const money = form.controls.money.value;
    if (!(money >= this.limit.depositMinPer && money <= this.limit.depositMaxPer)) {

      const min = this.decimalPipe.transform(this.limit.depositMinPer, '1.0-2');
      const max = this.decimalPipe.transform(this.limit.depositMaxPer, '1.0-2');
      const limitMsg = `${this.limitTxt} ${min}~${max}`;
      this.toast.error(limitMsg, 3000);

      return;
    }

    this.tmpForm = form;
    this.bankinfo.applyAmount = form.controls.money.value;
    this.bankStatus = bankpage.review;
  }

  commitDeposit(form: FormGroup): void {

    // console.log('form', form, form.invalid);

    if (form.invalid) {
      return;
    }

    // this.tmpForm = null;

    const money = form.controls.money.value;

    if (!(money >= this.limit.depositMinPer && money <= this.limit.depositMaxPer)) {

      const min = this.decimalPipe.transform(this.limit.depositMinPer, '1.0-2');
      const max = this.decimalPipe.transform(this.limit.depositMaxPer, '1.0-2');
      const limitMsg = `${this.limitTxt} ${min}~${max}`;
      this.toast.error(limitMsg, 3000);

      return;
    }

    const transactionAt = DayjsService.getDayjsObj(new Date(), timeFormat);
    // console.log('transactionAt', transactionAt);
    form.controls.transactionAt.patchValue(transactionAt);


    // console.log("**", form.value);

    this.depositService.commit(form.value)
      .subscribe(
        (res) => {
          // console.log('res', res);

          form.reset();

          for (const key in this.depositInvalidErr) {
            if (this.depositInvalidErr.hasOwnProperty(key)) {

              this.depositInvalidErr[key] = '';

            }
          }

          this.loadLastDeposit();



        }, ({ error }) => {

          // console.log('error', error);

          if (error.errors) {

            const { errors } = error;

            Object.assign(this.depositInvalidErr, errors);


            let msg = '';

            for (const p of Object.keys(errors)) {

              const t = errors[p];

              if (Array.isArray(t)) {

                const tmp = t.join(' ');
                msg += tmp;

              } else if (typeof errors[p] == 'string') {

                msg += errors[p];
              }

            }

            this.toast.error(msg, 3000);

          } else if (error.message) {

            this.depositInvalidErr.message = error.message;
            this.toast.error(error.message, 3000);

          }
        });
  }

  loadLastDeposit(): void {
    this.depositService.lastOrAddDeposit()
      .subscribe((res: any) => {

        if (res.data) {

          this.bankinfo = res.data;
          this.bankinfo.applyAmount = parseInt(this.bankinfo.applyAmount);

          this.form.get('id').patchValue(this.bankinfo.id);

          if (this.bankinfo.status !== this.reviewStatus.Review) {

            this.form.get('money').enable();
            this.form.get('transactionId').enable();
            const ctrl_transactionAt = this.form.get('transactionAt');
            ctrl_transactionAt.enable();
            ctrl_transactionAt.patchValue(DayjsService.getDayjsObj(new Date(), inputTimeFormat));

          } else {

            //review

            this.bankStatus = bankpage.review;

            // tb review 是另個畫面, 所以不用控制 form 了吧

            // this.form.controls.transactionAt.patchValue(DayjsService.getDayjsObj(this.bankinfo.remarkTransactionAt, inputTimeFormat));

            // const ctrl_money = this.form.get('money');
            // ctrl_money.disable();
            // ctrl_money.patchValue(this.bankinfo.applyAmount);

            // const ctrl_transactionId = this.form.get('transactionId');
            // ctrl_transactionId.disable();
            // ctrl_transactionId.patchValue(this.bankinfo.remarkTransactionId);

            // const ctrl_transactionAt = this.form.get('transactionAt');
            // ctrl_transactionAt.disable();

          }

        }

      }, (err) => {

        // console.log('err', err);
        this.toast.error(err.error.message);


      });
  }


  goReview(): void {
    this.toast.forceAlert(this.langService.translations.MEMBER_DEPOSIT.go_chk_msg, () => {
      this.router.navigateByUrl(AppRoutes.REVIEW_MAIN);
    });

  }

  getTypeDisplay(type: any, typeName): { typeName, class } {
    type = type.toLowerCase();

    const typename = this.langService.translations.MEMBER_DEPOSIT.methods[type];

    return (typename) ? {
      typeName: typename,
      class: type
    } : {
      typeName: typeName,
      class: 'd4'
    };

  }

  changepayments(idx): void {
    this.selectedPayment = this.payments[idx];

    // console.log('changepayments', this.selectedPayment);

    this.paymentsAmounts = this.selectedPayment.amounts;
    this.setThirdAmountLimit();

  }

  setThirdAmountLimit(): void {

    this.thirdMin = this.getLimitMin(this.limit.depositMinPer, this.selectedPayment.minAmount);
    this.thirdMax = this.getLimitMax(this.limit.depositMaxPer, this.selectedPayment.maxAmount);

    this.thirdForm.controls.amount.patchValue(this.thirdMin);

    if (this.selectedPayment.amounts && this.selectedPayment.amounts.length > 0) {

      // console.log('amounts', this.selectedPayment.amounts);

      this.paymentsAmounts = this.amountsFilter(
        this.selectedPayment.amounts,
        this.limit.depositMinPer,
        this.limit.depositMaxPer,
        this.selectedPayment.minAmount,
        this.selectedPayment.maxAmount
      );

    }
  }

  thirdDeposit() {

    // console.log('selectedPayment', this.selectedPayment);

    const { value } = this.thirdForm;

    // console.log('thirdDeposit value', value);

    const data = {
      paymentId: this.selectedPayment.id,
      amount: Number(value.amount),
      bankGroupId: this.selectedPayment.bankGroupId,
      fullpayId: this.selectedPayment.fullpayId
    };

    // console.log('data', data);

    if (!(data.amount >= this.thirdMin && data.amount <= this.thirdMax)) {
      const min = this.decimalPipe.transform(this.thirdMin, '1.0-2');
      const max = this.decimalPipe.transform(this.thirdMax, '1.0-2');
      const limitMsg = `${this.limitTxt} ${min}~${max}`;
      this.toast.error(limitMsg, 3000);
      return;
    }

    this.depositService.thirdDeposit(data);
  }

  amountsFilter(amounts, clubMin, clubMax, thirdMin, thirdMax) {
    let max = this.getLimitMax(clubMax, thirdMax);
    let min = this.getLimitMin(clubMin, thirdMin);

    let result = [];

    amounts.forEach((amount) => {
      if (amount <= max && amount >= min) {
        result.push(amount);
      }
    });

    return result;
  }

  getLimitMax(clubMax, thirdMax) {

    if (thirdMax == 0) {
      return clubMax;
    }

    if (thirdMax > clubMax) {
      return clubMax;
    }

    return thirdMax;
  }

  getLimitMin(clubMin, thirdMin) {

    if (thirdMin < clubMin) {
      return clubMin;
    }
    return thirdMin;
  }

  goSubPage(url, tab): void {
    this.publicService.tmpSublink = tab;
    this.router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.$review.unsubscribe();
  }
}
