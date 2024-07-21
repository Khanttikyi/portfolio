


import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable, ReplaySubject } from 'rxjs';
import { ENTER_SCALE, TRANSITION_AREA_SLIDE, TRANSITION_IMAGE_SCALE, TRANSITION_TEXT } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-project-experience',
  templateUrl: './project-experience.component.html',
  styleUrls: ['./project-experience.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_AREA_SLIDE,
    TRANSITION_IMAGE_SCALE,
    ENTER_SCALE
  ]
})
export class ProjectExperienceComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false
  projects = [
    {
      name: 'Coca Cola Myanmar (Invoice Delivery)',
      platform: '(Android/IOS) with Angular',
      description: 'Coca Cola Myanmar (Invoice Delivery) is the application that developed with Angular/Ionic for mobile android and IOS.',
      responsibilities: [
        'Collaborated with a team of designers, backend developers, and QA testers to deliver high-quality solutions that met client requirements.',
        'Developed responsive and user-friendly interfaces for Android and iOS platforms using Angular and Ionic frameworks.',
      ]
    },
    {
      name: 'Danone Myanmar',
      platform: '(Android/IOS) with Angular',
      description: 'Danone Myanmar is the application that developed with Angular/Ionic for mobile android and IOS.',
      responsibilities: [
        'Collaborated with a team of designers, backend developers, and QA testers to deliver high-quality solutions that met client requirements.',
        'Developed responsive and user-friendly interfaces for Android and iOS platforms using Angular and Ionic frameworks.',
      ]
    },
    {
      name: 'Dai-ichi Insurance Myanmar',
      platform: '(Android/IOS) with Angular',
      description: 'Dai-ichi Insurance Myanmar is mobile application which need to support both online and offline',
      responsibilities: [
        'Played a key role in developing cross-platform mobile applications using Angular and Ionic frameworks for both offline and online use.',
        'Integrated with Third Party API which is from ByteForce',
        'Collaborated with a team of designers, backend developers, and QA testers to deliver high-quality solutions that met client requirements.',
        'Developed responsive and user-friendly interfaces for Android and iOS platforms using Angular and Ionic frameworks.',
        'Implemented offline capabilities using service workers and caching mechanisms to ensure seamless performance in low-connectivity environments.',
        'Integrated platform-specific features and APIs for both Android and iOS, optimizing the applications for each platform\'s unique requirements.'
      ]
    },    
    {
      name: 'BNK Myanmar Microfinance (Employee App)',
      platform: '(Android/IOS) with Angular',
      description: "BNK Myanmar is the Microfinance company of Korea-Myanmar company and it had Agent application and Customer application to apply loan and process the hole microfinance process.",
      responsibilities: [
        'Developed the frontend side with Angular/Ionic.',
        'Played a key role in developing cross-platform mobile applications using Angular and Ionic frameworks for both offline and online use.',
        'Integrated with Third Party API which is from BNK Korea Team',
      ]
    },
    {
      name: 'BNK Myanmar Microfinance (BNK SUM)',
      platform: '(Android/IOS) with Angular',
      description: " BNK SUM is a microfinance application that for BNK 's customers. The customers can request and calculate loan for each loan type. In BNK Myanmar.",
      responsibilities: [
        'Developed the frontend side with Angular/Ionic.',
        'Played a key role in developing cross-platform mobile applications using Angular and Ionic frameworks for both offline and online use.',
        'Integrated with Third Party API which is from BNK Korea Team',
      ]
    },
    {
      name: 'KBZMS Insurance Sale Portal',
      platform: '(Web/Android/IOS) with Angular',
      description: "KBZMS is developed to be empowered as a KBZMS producer to perform your entire sales process on-line. KRIS provides the ability to:Enhance your mobility, as the application will be available round the clock.Streamline the tedious process of insurance proposal submission (& eliminate you having to deal with paper).Take charge of sales goal targets with overall performance indicator achievements against KPI targets.",
      responsibilities: [
        'Developed dynamic UI configuration and Web portal with Angular and both android and IOS app with Ionic.',
        'Played a key role in developing cross-platform mobile applications using Angular and Ionic frameworks.',
        'Collaborated with a team of designers, backend developers, and QA testers to deliver high-quality solutions that met client requirements.',
        'Developed responsive and user-friendly interfaces for Android and iOS platforms using Angular and Ionic frameworks.',
      ]
    },
    {
      name: 'KBZMS Insurance Customer Care',
      platform: '(Web/Android/IOS) with Angular',
      description: 'Access all of your KBZMS insurance policy information & be empowered to manage your policy data on the go via the KBZMS Customer Care mobile app.',
      responsibilities: [
        'Developed UI configuration and Web portal with Angular and both android and IOS app with Ionic.'
      ]
    }
  ];
  /* ********************************************************************************************
  *                anims
  */
  _mTriggerAnim?= 'false'

  _mTriggerImage?= 'false'


  _mThreshold = 0.2

  
  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;
  
  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler) { }

  ngOnInit(): void {
  }

  

  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {
    
    this.destroyed$.next(true)
    this.destroyed$.complete()
  }


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => {
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }

}
