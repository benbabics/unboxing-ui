import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { debounce, snakeCase, get, pick, values, chain, last } from 'lodash';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { takeUntil, tap, map, filter, flatMap, take, debounceTime, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { UpdateFormDirty, UpdateFormValue } from '@ngxs/form-plugin';
import { CurrentMembershipState, Project, ProjectInvitation, ProjectInvitationState, ProjectMembership, ProjectMembershipState, ProjectState, User, UserState } from 'app/data';
import { EntityActionType, ofEntityActionSuccessful, SetLoading } from '@ngxs-labs/entity-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectSlugValidator } from '../../validators';

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

  readonly formPath = "project.projectActive.manageProjectForm";
  
  isLoading: boolean = false;
  isLoadingInvitation: boolean = false;
  isLoadingMember: boolean = false;

  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;
  
  memberSuggestions = [];
  members: ProjectMembership[];
  invitations: ProjectInvitation[];

  @Input()  activeView: ProjectFormView = ProjectFormView.Advanced;
  @Output() activeViewChange = new EventEmitter<ProjectFormView>();

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSumbit = new EventEmitter<Project>();

  @Select( ProjectMembershipState.entities ) members$: Observable<ProjectMembership[]>;
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
  get controlMember(): FormGroup {
    return get( this.manageProjectForm, 'controls.section2.controls.member' );
  }

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _slugValidator: ProjectSlugValidator,
  ) {
    this._store.dispatch(
      new UpdateFormDirty({ path: this.formPath, dirty: false })
    );

    this._buildForm();

    _store.select( ProjectState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoading = isLoading);

    _store.select( ProjectInvitationState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoadingInvitation = isLoading);

    _store.select( ProjectMembershipState.loading )
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
      ofEntityActionSuccessful( ProjectMembershipState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      map(payload => `${ payload.firstname } ${ payload.lastname }`),
      tap(fullname => snackBar.open( `Added ${ fullname } to the project!`, `Ok` )),
      )
      .subscribe();

    actions$.pipe(
      ofActionSuccessful( User.SearchResults ),
      takeUntil( this._destroy$ ),
      withLatestFrom( this.members$ ),
      map(([{ payload }, members]) => payload.filter(({ userId }) => !members.map(({ id }) => id).includes( userId ))),
      tap(users => this.memberSuggestions = users),
    )
    .subscribe();
      
    this.controlMember.get( 'query' ).valueChanges.pipe(
      takeUntil( this._destroy$ ),
      debounceTime( 300 ),
      filter(query => !!query && query.length > 1),
      switchMap(query => this._store.dispatch( new User.SearchQuery(query) )),
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

  displayWithMember({ user }): string {
    if ( user?.firstname && user?.lastname ) {
      return `${ user.firstname } ${ user.lastname }`;
    }

    return '';
  }

  handleSubmitMember(): void {
    const member = this.manageProjectForm.get( 'section2.member.query' ).value;
    console.log('* handleSubmitMember', member);
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
