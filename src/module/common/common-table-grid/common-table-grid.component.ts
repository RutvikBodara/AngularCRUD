import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  Pipe,
  PipeTransform,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { delay, retryWhen, scan, Subscription } from 'rxjs';
import { ComponentService } from '../../../services/component.service';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
import {
  columnFields,
  genericResponeDemo,
  product,
  result,
} from '../../../interface/result';
import { CommonModule, DatePipe } from '@angular/common';
import { DeleteProductDialogComponent } from '../../procat/product/action-menu/delete-product-dialog/delete-product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { leadingComment } from '@angular/compiler';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-common-table-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    CommonTableGridComponent,
    MatTooltipModule,
    DragDropModule,
    MatMenuModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatGridListModule,
    MatCheckboxModule,
  ],
  
  templateUrl: './common-table-grid.component.html',
  styleUrl: './common-table-grid.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
// @Pipe({
//   name:'highlight'
// })
export class CommonTableGridComponent {
  // transform(value: any, ...args: any[]) {
  //   if(!args){return value;}
  //   for (const text in args){
  //     var regex = new RegExp(text,'gi')
  //     value = value.replace(regex, "<span class='highlight-search-text'>" + text + "</span>");
  //   }
  // }
  commonSearch = null;
  errorMessage: String = 'No Data Found';
  searchStringSubscription: Subscription;
  getProductSubscription: Subscription;
  currentIndex = 0;

  editedRowIndex;
  editedRow;

  @Input()
  editable?: boolean = false;

  countrow: number;
  @Input()
  IsparentComponent?: boolean = true;

  @Input()
  bulkDeleteEnable?: boolean = false;

  @Input()
  IsChildComponent?: boolean;

  @Input()
  isthisChild?: boolean = false;

  lengthColumn: number;
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  @Input()
  displayedColumns: string[] = [];

  @Input()
  childDisplayColumns?: string[];

  @Input()
  dataSource;

  @Input()
  paginatorLength;

  @Input()
  childPaginatorLength?;

  @Input()
  expandableGrid: boolean = false;

  @Input()
  paginationAllowed: boolean = false;

  @Input()
  actionBtnAllowed: boolean = false;

  pageNumber;

  retryCount: number = 1;

  pagenumber: number;
  @Input()
  pagesize: number;

  @Input()
  childColumnValues?: columnFields[];

  @Input()
  childTable?;

  @Input()
  columnValues: columnFields[];

  sortedcolumn: string;
  sorteddirection: string;
  expandedElement;

  @Output()
  paginationChanged: EventEmitter<number[]> = new EventEmitter<number[]>();

  @Output()
  orderChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  upDatedEditValue = new EventEmitter();

  @Output()
  potentialEdit = new EventEmitter();

  @Output()
  deleteIdEmit: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  getChildTableDataEmit = new EventEmitter();

  @Output()
  selectedDeleteBulk = new EventEmitter();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private componentServices: ComponentService,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnValues']) {
      if (changes['columnValues'].currentValue != null) {
        this.displayedColumns = [];
        changes['columnValues'].currentValue.forEach((element) => {
          this.displayedColumns.push(element.columnName);
        });
      }
    }
  }

  ngOnInit() {
    // this.commonService.clearSelection$.subscribe((Res)=>{
    //   if(Res){
    //     this.selection.clear();
    //     this.commonService.clearSelectionUpdate(false);
    //   }
    // })
    // this.data = this.data;
    // this.data = new MatTableDataSource(this.data);
    // console.log(this.data);
    // console.log(this.childTable);
    // this.lengthColumn = this.displayedColumns.length;
    // this.paginator.length =this.paginatorLength;
  }

  startEdit(row, index) {
    this.editedRowIndex = index;
    this.editedRow = row;
  }

  cancelEdit() {
    this.editedRowIndex = -1;
  }
  saveUpdate() {
    if (this.editedRow != null) {
      this.potentialEdit.emit(this.editedRow);
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        console.log('Page Index:', event.pageIndex);
        this.pagenumber = event.pageIndex + 1;
        this.pagesize = event.pageSize;
        this.selection.clear();
        this.paginationChanged.emit([this.pagenumber, this.pagesize]);
      });
    }
    // this.dataSource.paginator = this.paginator;
    // this.data.sort = this.sort;
  }

  selection = new SelectionModel<any>(true, []);

  // Method to determine if all rows are selected
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  // Method to determine if some (but not all) rows are selected
  isAnySelectedButNotAll() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected > 0 && numSelected < numRows;
  }

  // Method to toggle all row selections
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      console.log('else');
      console.log(this.dataSource);
      this.dataSource.forEach((row) => this.selection.select(row));
    }
  }

  // Method to toggle selection for an individual row
  toggleSelection(row: any) {
    this.selection.toggle(row);
  }

  // Method to delete selected rows
  deleteSelected() {
    const selectedRows = this.selection.selected;
    console.log(selectedRows);
    this.selectedDeleteBulk.emit(selectedRows);
    //  this.selection.clear()
    // this.dataSource = this.dataSource.filter(row => !selectedRows.includes(row));
  }

  toggleRow(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandableGrid) {
      this.getChildTableDataEmit.emit(this.expandedElement);
    }
  }

  // int? pagenumber, int? pagesize, string? sortedcolumn, string? sorteddirection
  announceSortChange(sortState: Sort) {
    console.log('i am sorted');
    if (sortState.direction) {
      this.sortedcolumn = sortState.active;
      this.sorteddirection = sortState.direction;
      this.orderChanged.emit([this.sortedcolumn, this.sorteddirection]);
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.sortedcolumn = null;
      this.sorteddirection = null;
      this.orderChanged.emit([this.sortedcolumn, this.sorteddirection]);
      console.log(this.sortedcolumn + ' ' + this.sorteddirection);
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    // const previousIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  }

  setStep(index: number) {
    this.currentIndex = index;
  }

  nextStep() {
    this.currentIndex++;
  }

  prevStep() {
    this.currentIndex--;
  }

  onEditButtonClick(data, index): void {
    if (this.editable) {
      this.startEdit(data, index);
    } else {
      this.potentialEdit.emit(data);
    }
    //give data back to parent
  }

  onDeleteButtonClick(data): void {
    this.commonService.updateProductDetails(data);
    this.deleteIdEmit.emit(data);
  }

  // onPageChange(): void {
  //   const pageIndex = this.paginator.pageIndex;
  //   const pageSize = this.paginator.pageSize;
  //   console.log(`Page index: ${pageIndex}`);
  //   console.log(`Page size: ${pageSize}`);

  //   // Fetch new data or update data source based on page index and size
  //   // e.g., this.fetchData(pageIndex, pageSize);
  // }

  isDateColumn(column: string): boolean {
    // Define your logic to identify date columns
    // For example, you might have a list of date columns
    const dateColumns = ['updatedDate', 'createddate', 'createdDate']; // Adjust based on your data
    return dateColumns.includes(column);
  }

  convertToMatTableDataSource(data) {
    console.log(data);
  }
}
