import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelpCenterService } from 'app/modules/admin/pages/help-center/help-center.service';
import { GuideCategory } from 'app/modules/admin/pages/help-center/help-center.type';

@Component({
    selector     : 'help-center-guides',
    templateUrl  : './guides.component.html',
    styleUrls    : ['./guides.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HelpCenterGuidesComponent implements OnInit, OnDestroy
{
    guideCategories: GuideCategory[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HelpCenterService} _helpCenterService
     */
    constructor(
        private _helpCenterService: HelpCenterService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the Guide categories
        this._helpCenterService.guides$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((guideCategories) => {
                this.guideCategories = guideCategories;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}