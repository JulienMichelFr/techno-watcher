import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isSignedIn } from '../../../+state/auth/auth.selectors';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[technoWatcherShowOnSignedIn]',
})
export class ShowOnSignedInDirective implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public constructor(private el: ElementRef, private store: Store) {}

  public ngOnInit(): void {
    const initialDisplay: string = this.el.nativeElement.display;
    this.subscription.add(
      this.store.select(isSignedIn).subscribe((isSignedIn) => {
        if (isSignedIn) {
          this.el.nativeElement.style.display = initialDisplay;
        } else {
          this.el.nativeElement.style.display = 'none';
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
