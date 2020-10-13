import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { debounce, snakeCase, get, pick, values, chain } from 'lodash';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { takeUntil, tap, map, filter, flatMap, take } from 'rxjs/operators';
import { Actions, Select, Store } from '@ngxs/store';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CurrentMembershipState, Project, ProjectInvitation, ProjectInvitationState, ProjectMember, ProjectMemberState, ProjectSlugValidator, ProjectState, User } from './../../../../../../../../projects/lib-common/src/public-api';
import { EntityActionType, ofEntityActionSuccessful, SetLoading } from '@ngxs-labs/entity-state';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoadingInvitation: boolean = false;
  isLoadingMember: boolean = false;

  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;
  
  members: ProjectMember[];
  invitations: ProjectInvitation[];

  @Input()  activeView: ProjectFormView = ProjectFormView.Advanced;
  @Output() activeViewChange = new EventEmitter<ProjectFormView>();

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSumbit = new EventEmitter<Project>();

  @Select( ProjectMemberState.entities ) members$: Observable<ProjectMember[]>;
  @Select( ProjectInvitationState.entities ) invitations$: Observable<ProjectInvitation[]>;

  get controlBrandId(): AbstractControl {
    return get(this.manageProjectForm, 'controls.section1.controls.brandId');
  }

  get controlSlug(): AbstractControl {
    return get( this.manageProjectForm, 'controls.section1.controls.slug' );
  }
  get isValidatingSlug$(): BehaviorSubject<boolean> {
    return this._slugValidator.isLoading$;
  }

  get controlInvitation(): FormGroup {
    return get( this.manageProjectForm, 'controls.section2.controls.invitation' );
  }

  get controlMember(): FormArray {
    return get(this.manageProjectForm, 'controls.section2.controls.member');
  }

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _slugValidator: ProjectSlugValidator,
  ) {
    this._buildForm();

    _store.select( ProjectState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoading = isLoading);

    _store.select( ProjectInvitationState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoadingInvitation = isLoading);

    _store.select( ProjectMemberState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoadingMember = isLoading);

    combineLatest([
      _store.select( ProjectState.active ),
      _store.select( CurrentMembershipState.accountId ),
    ])
    .pipe(
      takeUntil( this._destroy$ ),
      tap(([ project ]) => this._currentValueSlug = project?.slug),
      map(([ project, accountId ]) => ({ accountId, ...project })),
      map(project => this._updateProjectForm( project )),
    )
    .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( ProjectInvitationState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      tap(({ payload }) => snackBar.open( `Invited ${ payload.email } to the project!`, `Ok` )),
    )
    .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( ProjectMemberState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      map(payload => `${ payload.firstname } ${ payload.lastname }`),
      tap(fullname => snackBar.open( `Added ${ fullname } to the project!`, `Ok` )),
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

  handleSubmitMember(): void {
    const query = get( this.manageProjectForm, 'value.section2.member.query' );
    this._store.dispatch( new User.Query( query ));
  }

  handleRemoveMember(id: string): void {
    console.log('* handleRemoveMember', id);
  }

  handleSubmitInvitation(): void {
    const projectId = this._store.selectSnapshot( ProjectState.activeId );
    const email = get( this.manageProjectForm, 'value.section2.invitation.email' );

    if ( email ) {
      this._store.dispatch( new ProjectInvitation.Create(projectId, email) )
        .pipe(
          tap(() => this._store.dispatch([
            new UpdateFormValue({
              path: this.formPath,
              propertyPath: "section2.invitation",
              value: { email: "" },
            }),
          ])),
        )
        .subscribe();
    }
  }

  handleRemoveInvitation(id: string): void {
    this._store.dispatch( new ProjectInvitation.Destroy(id) );
  }

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
      id:        new FormControl(''),
      accountId: new FormControl('', [ Validators.required ]),

      section1: new FormGroup({
        title:   new FormControl('', [ Validators.required ]),
        slug:    new FormControl('', [ Validators.required ]),
        brandId: new FormControl('', [ Validators.required ]),
        date:    new FormControl('', []),
      }),

      section2: new FormGroup({
        invitation: new FormGroup({
          email: new FormControl(''),
        }),
        member: new FormGroup({
          query: new FormControl(''),
        }),
      }),

      section3: new FormGroup({ }),
    });
  }

  private _updateProjectForm(project: Project) {
    const section1 = pick( project, 'date', 'brandId', 'slug', 'title' );
    
    this._store.dispatch(new UpdateFormValue({
      path: this.formPath,
      value: {
        section1,
        ...pick( project, 'id', 'accountId' ),
      },
    }));
  }
}
