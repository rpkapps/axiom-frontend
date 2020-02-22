import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { IUiWidget } from './symbols';
import { UiWidgetComponent } from './widget.component';
import { UiWidgetService } from './widget.service';


@NgModule({
  declarations: [UiWidgetComponent],
  imports: [CommonModule],
  exports: [UiWidgetComponent]
})
export class UiWidgetModule {
  static forRoot(widgets: IUiWidget[]): ModuleWithProviders<UiWidgetModule> {
    return {
      ngModule: UiWidgetModule,
      providers: [
        {
          provide: UiWidgetService,
          deps: [ComponentFactoryResolver],
          useFactory: (componentFactoryResolver) => {
            const widgetService = new UiWidgetService(componentFactoryResolver);
            widgets.forEach(w => widgetService.register(w));
            return widgetService;
          }
        }
      ]
    };
  }
}
