import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { removeDuplicateItemsFromArray } from '@axiom/infrastructure';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportService } from '../../import.service';

@Component({
  selector: 'lx-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTagsComponent {
  constructor(
    public importService: ImportService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    importService.analyzeFile();
  }

  addedTags$ = new BehaviorSubject<string[]>([]);
  availableTags$ = combineLatest([this.importService.getTagGroup(), this.addedTags$])
    .pipe(
      map(([a, b]) => {
        return removeDuplicateItemsFromArray([...a.Tags, ...b]).sort();
      })
    );

  get columnsToShow() {
    const {IndexColumns, DataColumns} = this.importService.analyzeOptions;
    return [...(IndexColumns || []), ...(DataColumns || [])];
  }

  onBackClick() {
    this._router.navigate(['../columns'], { relativeTo: this._route });
  }

  onTagsChange() {
    const tags = Object.values(this.importService.importOptions.ColumnTags || {})
      // @ts-ignore
      .flat();

    this.addedTags$.next(tags);
  }
}
