import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { debounce, snakeCase, get, pick } from 'lodash';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { takeUntil, tap, map, filter, flatMap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CurrentMembershipState, Project, ProjectSlugValidator, ProjectState } from './../../../../../../../../projects/lib-common/src/public-api';

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
  private _currentValueSlug: string;

  readonly formPath = "project.manageProjectForm";
  
  isLoading: boolean = false;

  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;

  @Input()  activeView: ProjectFormView = ProjectFormView.Advanced;
  @Output() activeViewChange = new EventEmitter<ProjectFormView>();

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSumbit = new EventEmitter<Project>();

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
    private _store: Store,
    private _slugValidator: ProjectSlugValidator,
  ) {
    this._buildForm();

    _store.select( ProjectState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoading = isLoading);

    combineLatest([
      _store.select( ProjectState.active ),
      _store.select( CurrentMembershipState.accountId ),
    ])
    .pipe(
      takeUntil( this._destroy$ ),
      tap(([ project ]) => this._currentValueSlug = project?.slug),
      map(([ project, accountId ]) => ({ accountId, ...project })),
      tap(project => this._updateProjectForm( project )),
    )
    .subscribe();

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

    if ( slug.value !== this._currentValueSlug ) {
      slug.setAsyncValidators(() => this._slugValidator.checkDuplicateControl( slug ));
      slug.updateValueAndValidity();
      slug.clearAsyncValidators();
    }
  }, 1000);

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleSubmit(): void {
    const { section1, section2, section3, ...project } = this.manageProjectForm.getRawValue();
    if ( section1.date.format ) {
      section1.date = section1.date.format( "YYYY-MM-DD HH:mm:ss" );
    }
    
    const payload = {
      ...project,
      ...section1,
      ...section2,
      ...section3
    };

    of([ payload.slug, this._currentValueSlug ])
      .pipe(
        flatMap(([slug, currentValueSlug]) => {
          if ( slug === currentValueSlug ) return of( true );
          return this._slugValidator.checkDuplicateValue( payload.slug );
        }),
        filter(isValid => isValid),
        tap(() => this.onSumbit.emit( payload ))
      )
      .subscribe();
  }

  private _buildForm(): void {
    this.manageProjectForm = new FormGroup({
      id:        new FormControl( '' ),
      accountId: new FormControl( '', [ Validators.required ]),

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

  private _updateProjectForm(project: Project) {
    this._store.dispatch(new UpdateFormValue({
      path: this.formPath,
      value: {
        ...pick( project, 'id', 'accountId' ),

        section1: {
          ...pick( project, 'date', 'brandId', 'slug', 'title' ),
        },
      },
    }));
  }
}
