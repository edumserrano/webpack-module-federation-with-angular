import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyFeatureModule } from 'src/app/my-feature/my-feature.module';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), MyFeatureModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
