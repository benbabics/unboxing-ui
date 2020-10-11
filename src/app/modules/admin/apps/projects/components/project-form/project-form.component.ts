import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { debounce, snakeCase, get, pick, values, chain } from 'lodash';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { takeUntil, tap, map, filter, flatMap, take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CurrentMembershipState, Project, ProjectInvitation, ProjectInvitationState, ProjectMember, ProjectMemberState, ProjectSlugValidator, ProjectState } from './../../../../../../../../projects/lib-common/src/public-api';

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
  invitationIsLoading: boolean = false;

  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;
  
  members: ProjectMember[];
  invitations: ProjectInvitation[];

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

  get controlInvitation(): FormGroup {
    return get( this.manageProjectForm, 'controls.section2.controls.invitation' );
  }
  get controlInvitations(): FormArray {
    return get( this.manageProjectForm, 'controls.section2.controls.invitations' );
  }

  constructor(
    private _store: Store,
    private _slugValidator: ProjectSlugValidator,
  ) {
    this._buildForm();

    _store.select( ProjectState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.isLoading = isLoading);

    _store.select( ProjectInvitationState.loading )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(isLoading => this.invitationIsLoading = isLoading);

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

    _store.select( ProjectMemberState.entities )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(members => this._buildMemberForm( members ));

    _store.select( ProjectInvitationState.entities )
      .pipe( takeUntil(this._destroy$) )
      .subscribe(invitations => this._buildInvitationForm( invitations ));
      
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
          role:  new FormControl(''),
        }),
        invitations: new FormArray([]),
        members:     new FormArray([]),
      }),
      section3: new FormGroup({ }),
    });
  }

  private _buildInvitationForm(invitations: ProjectInvitation[]) {
    const control = this.manageProjectForm.get('section2.invitations') as FormArray;
    control.clear();
    invitations.forEach(invitation => control.push(new FormGroup({
      id:    new FormControl({ value: invitation.id, disabled: true }),
      role:  new FormControl({ value: "USER", disabled: true }),
      email: new FormControl( invitation.email ),
    })));
  }

  private _buildMemberForm(members: ProjectMember[]) {
    const control = this.manageProjectForm.get( 'section2.members' ) as FormArray;
    control.clear();
    members.forEach(member => control.push(new FormGroup({
      id:        new FormControl({ value: member.id,        disabled: true }),
      email:     new FormControl({ value: member.email,     disabled: true }),
      firstname: new FormControl({ value: member.firstname, disabled: true }),
      lastname:  new FormControl({ value: member.lastname,  disabled: true }),
      avatar:    new FormControl({ value: member.avatar,    disabled: true }),
      role:      new FormControl({ value: member.role,      disabled: true }),
    })));
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
