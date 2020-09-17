import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { debounce, snakeCase, get } from 'lodash';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectSlugValidator } from './../../../../../../../../projects/lib-common/src/public-api';

export enum ProjectFormView {
  Wizard   = "PROJECT_VIEW_WIZARD",
  Advanced = "PROJECT_VIEW_ADVANCED",
}

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  providers: [ ProjectSlugValidator ],
})
export class ProjectFormComponent implements OnChanges, OnDestroy {

  private _destroy$ = new Subject();
  
  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;

  @Input()  activeView: ProjectFormView = ProjectFormView.Advanced;
  @Output() activeViewChange = new EventEmitter<ProjectFormView>();

  get controlBrandId(): AbstractControl {
    return get(this.manageProjectForm, 'controls.section1.controls.brandId');
  }

  get controlSlug(): AbstractControl {
    return get( this.manageProjectForm, 'controls.section1.controls.slug' );
  }
  get isValidatingSlug$(): BehaviorSubject<boolean> {
    return this._slugValidator.isLoading$;
  }

  constructor(
    private _slugValidator: ProjectSlugValidator,
  ) {
    this._buildForm();

    this.activeViewChange
      .pipe( takeUntil(this._destroy$) )
      .subscribe(() => this.formatValueSlug());
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
  
  ngOnChanges({ activeView }: SimpleChanges) {
    this.updateActiveView( activeView.currentValue );
  }

  updateActiveView(activeView: ProjectFormView): void {
    this.activeView = activeView;
    this.activeViewChange.emit( this.activeView );
  }

  formatValueSlug = debounce((): void => {
    const slug: AbstractControl = this.controlSlug;
    slug.patchValue( snakeCase(slug.value) );
    slug.setAsyncValidators(() => this._slugValidator.checkDuplicateControl( slug ));
    slug.updateValueAndValidity();
    slug.clearAsyncValidators();
  }, 1000);

  private _buildForm(): void {
    this.manageProjectForm = new FormGroup({
      section1: new FormGroup({
        title:   new FormControl('', [ Validators.required ]),
        slug:    new FormControl('', [ Validators.required ]),
        brandId: new FormControl('', [ Validators.required ]),
        date:    new FormControl('', [ ]),
      }),
      section2: new FormGroup({ }),
      section3: new FormGroup({ }),
    });
  }
}
