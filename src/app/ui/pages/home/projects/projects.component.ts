import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable, ReplaySubject } from 'rxjs';
import { ENTER_SCALE, TRANSITION_AREA_SLIDE, TRANSITION_IMAGE_SCALE, TRANSITION_TEXT } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_AREA_SLIDE,
    TRANSITION_IMAGE_SCALE,
    ENTER_SCALE
  ]
})
export class ProjectsComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false

  projects = [
    {
      name: 'Dai-Ichi Insurance Myanmar',
      screenshots: [
         'assets/img/projects/dlmm.png' ,
         'assets/img/projects/dlmm2.png' ,
         'assets/img/projects/dlmm1.png',
         'assets/img/projects/dlmm3.png'
      ]
    },
    {
      name: 'KBZMS Customer Care',
      screenshots: [
         'assets/img/projects/kbz-ms-3.jpeg' ,
         'assets/img/projects/kbz-ms-2.jpeg' ,
         'assets/img/projects/kbz-ms-1.jpeg',
         'assets/img/projects/kbz-ms.jpeg'
      ]
    },
    {
      name: 'KBZMS Real Time Insurance System',
      screenshots: [
         'assets/img/projects/kbz-sale.png' ,
         'assets/img/projects/kbz-sale3.png' ,
         'assets/img/projects/kbz-sale2.png',
         'assets/img/projects/kbz-sale4.png'
      ]
    },
    {
      name: 'BNK Capital Myanmar',
      screenshots: [
         'assets/img/projects/bnk.jpeg' ,
         'assets/img/projects/bnk4.jpeg' ,
         'assets/img/projects/bnk1.jpeg',
         'assets/img/projects/bnk3.jpeg'
      ]
    },
   
    // more projects
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
