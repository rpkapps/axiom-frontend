import { NgModule } from '@angular/core';
import { UiFilterPipe } from './filter.pipe';

const pipes = [UiFilterPipe];

@NgModule({
  declarations: pipes,
  exports: pipes
})
export class UiPipesModule {}
