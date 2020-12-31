import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./page/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./page/dashboard/dashboard.module').then(
        m => m.DashboardPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./page/upload/upload.module').then(m => m.UploadPageModule),
  },
  {
    path: 'inbox',
    loadChildren: () =>
      import('./page/inbox/inbox.module').then(m => m.InboxPageModule),
  },
  {
    path: 'scan',
    loadChildren: () =>
      import('./page/scan/scan.module').then(m => m.ScanPageModule),
  },
  {
    path: 'file',
    loadChildren: () =>
      import('./page/file/file.module').then(m => m.FilePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
