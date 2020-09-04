import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { CurrentAccountGuard } from 'app/core/current-account/current-account.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';


// @formatter:off
// tslint:disable:max-line-length
const Routes = {
  Admin: [
    { path: "brands",   loadChildren: () => import("app/modules/admin/apps/brands/brands.module").then(m => m.BrandsModule) },
    { path: "settings", loadChildren: () => import("app/modules/admin/apps/settings/settings.module").then(m => m.SettingsModule) },
    { path: "projects", loadChildren: () => import ("app/modules/admin/apps/projects/projects.module").then(m => m.ProjectsModule) },
    
    { path: 'example',     loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
    { path: 'profile',     loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule) },
    { path: 'help-center', loadChildren: () => import('app/modules/admin/pages/help-center/help-center.module').then(m => m.HelpCenterModule) },
    { path: 'errors/404',  loadChildren: () => import('app/modules/admin/pages/errors/error-404/error-404.module').then(m => m.Error404Module) },
    { path: 'errors/500',  loadChildren: () => import('app/modules/admin/pages/errors/error-500/error-500.module').then(m => m.Error500Module) },

    // 404 & Catch all
    { path: '**', redirectTo: 'errors/404' },
  ],

  Guest: [
    { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
    { path: 'forgot-password',       loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
    { path: 'reset-password',        loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
    { path: 'sign-in',               loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
    { path: 'sign-up',               loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
  ],

  Public: [
    { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
  ],

  User: [
    { path: 'context' ,       loadChildren: () => import('app/modules/context/context.module').then(m => m.ContextModule) },
    { path: 'sign-out',       loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
    { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) },
  ],
};


export const appRoutes: Route[] = [

  // Redirects
  {
    path:       '',
    pathMatch:  'full',
    redirectTo: 'example'
  },
  {
    path:       'signed-in-redirect',
    pathMatch:  'full',
    redirectTo: 'example'
  },

  // Public
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    children: Routes.Public,
  },

  // Guest
  {
    path: '',
    canActivate:      [ NoAuthGuard ],
    canActivateChild: [ NoAuthGuard ],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    children: Routes.Guest,
  },

  // User
  {
    path: '',
    canActivate:      [ AuthGuard ],
    canActivateChild: [ AuthGuard ],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    children: Routes.User,
  },

  // Admin
  {
    path: '',
    canActivate:      [ AuthGuard, CurrentAccountGuard ],
    canActivateChild: [ AuthGuard, CurrentAccountGuard ],
    component: LayoutComponent,
    data: {
      layout: 'vertical'
    },
    resolve: {
      initialData: InitialDataResolver,
    },
    children: Routes.Admin,
  }
];
