import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, inject, ContentChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

export interface IBasePaginationTableHeader {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'status' | 'actions' | 'currency' | 'stringWithPhoto' | 'icon' | 'currencyCode' | 'checkbox' | 'type' | 'datetime';
  sortable?: boolean;
  clickable?: boolean;
  width?: string;
  cssClass?: string;
  iconName?: string;
}

export interface IBasePaginationTableData {
  items: any[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

export interface IBasePaginationTableConfig {
  title: string;
  showCreateButton?: boolean;
  showEditButton?: boolean;
  showViewButton?: boolean;
  showDeleteButton?: boolean;
  showPageSizeChange?: boolean;
  showPageChange?: boolean;
  createButtonText?: string;
  showFilter?: boolean;
  filterPlaceholder?: string;
  filterLabel?: string;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showMobileCards?: boolean;
  mobileCardComponent?: string; // 'trip-card' | 'protector-card' | ''
  debounceTime?: number;
  clientSideSortingAndPagination?: boolean;
  showSelection?: boolean;
  selectionType?: 'single' | 'multiple';
  showCustomButton?: boolean;
  showActionsButton?: boolean;
  isViewVisible?: (row: any) => boolean;
}

// Default configuration with all buttons enabled by default
export const DEFAULT_TABLE_CONFIG: Partial<IBasePaginationTableConfig> = {
  showCreateButton: true,
  showEditButton: true,
  showViewButton: true,
  showDeleteButton: true,
  showPageSizeChange: true,
  showPageChange: true,
  showFilter: true,
  showPageSize: true,
  showPagination: true,
  showMobileCards: true,
  showSelection: false,
  clientSideSortingAndPagination: true,
  createButtonText: 'Create',
  filterPlaceholder: 'Search...',
  filterLabel: 'Filter:',
  pageSizeOptions: [5, 10, 25, 50],
  selectionType: 'multiple',
  showCustomButton: true,
  showActionsButton: true
};

export interface ICustomActionButton {
  key: string;
  label: string;
  fill?: 'solid' | 'clear' | 'outline';
  color?: string;
  cssClass?: string;
  icon?: string;
  disabled?: (row: any) => boolean;
  visible?: (row: any) => boolean;
}

// Utility function to create table config with defaults
export function createTableConfig(overrides: Partial<IBasePaginationTableConfig> = {}): IBasePaginationTableConfig {
  return {
    title: 'Data Table',
    ...DEFAULT_TABLE_CONFIG,
    ...overrides
  };
}

@Component({
  selector: 'app-base-pagination-table',
  templateUrl: './base-pagination-table.component.html',
  styleUrls: ['./base-pagination-table.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, TranslateModule]
})

export class BasePaginationTableComponent implements OnInit, OnDestroy, OnChanges {
  // ===== INPUTS =====
  @Input() headers: IBasePaginationTableHeader[] = [];
  @Input() data: IBasePaginationTableData = { items: [], total: 0, pageIndex: 0, pageSize: 10 };
  @Input() tiers: any[] = [];
  @Input() selectedRows: any[] = [];
  @ContentChild('mobileCards', { static: false }) mobileCardsContent: ElementRef | undefined;
  @Input() config: IBasePaginationTableConfig = {
    title: 'Data Table',
    ...DEFAULT_TABLE_CONFIG
  };
  @Input() customButtons: ICustomActionButton[] = [];

  @Output() onCreate = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCellClick = new EventEmitter<{ row: any; header: IBasePaginationTableHeader }>();
  @Output() onSort = new EventEmitter<{ field: string; direction: 'asc' | 'desc' }>();
  @Output() onFilter = new EventEmitter<string>();
  @Output() onPageSizeChange = new EventEmitter<number>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onRefreshRequested = new EventEmitter<void>();
  @Output() onSelectionChange = new EventEmitter<any[]>();
  @Output() onCustomAction = new EventEmitter<{ key: string; row: any }>();
  @Output() onActions = new EventEmitter<any>();

  hasCreateHandler: boolean = false;
  hasViewHandler: boolean = false;
  hasEditHandler: boolean = false;
  hasDeleteHandler: boolean = false;
  hasCellClickHandler: boolean = false;
  hasSortHandler: boolean = false;
  hasFilterHandler: boolean = false;
  hasPageSizeChangeHandler: boolean = false;
  hasPageChangeHandler: boolean = false;
  hasCustomButtonHandler: boolean = false;
  hasActionsHandler: boolean = false;

  form: FormGroup;
  filterText: string = '';

  pageSizeString: string = '10';
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  startItem: number = 0;
  endItem: number = 0;
  pageNumbers: number[] = [];

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Client-side data processing
  private allData: any[] = [];
  private filteredData: any[] = [];
  private sortedData: any[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      keyword: '',
    });
  }

  ngOnInit(): void {
    this.setupDebouncedSearch();
    this.initializeClientSideData();
  }

  ngOnChanges(): void {
    this.checkOutputHandlers();
    this.initializePagination();

    if (this.config.clientSideSortingAndPagination) {
      this.initializeClientSideData();
    } else {
      // For server-side pagination, update pagination info when data changes
      this.initializePagination();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateData(newData: IBasePaginationTableData): void {
    this.data = newData;
    if (this.config.clientSideSortingAndPagination) {
      this.allData = [...newData.items];
      this.processClientSideData();
    }
  }

  canShowView(row: any): boolean {
    if (!this.config.isViewVisible) return true;
    return this.config.isViewVisible(row);
  }

  private checkOutputHandlers(): void {
    this.hasCreateHandler = this.onCreate.observers.length > 0 && !!this.config.showCreateButton;
    this.hasViewHandler = this.onView.observers.length > 0 && !!this.config.showViewButton;
    this.hasEditHandler = this.onEdit.observers.length > 0 && !!this.config.showEditButton;
    this.hasDeleteHandler = this.onDelete.observers.length > 0 && !!this.config.showDeleteButton;
    this.hasCellClickHandler = this.onCellClick.observers.length > 0;
    this.hasSortHandler = this.onSort.observers.length > 0;
    this.hasFilterHandler = this.onFilter.observers.length > 0;
    this.hasPageSizeChangeHandler = this.onPageSizeChange.observers.length > 0;
    this.hasPageChangeHandler = this.onPageChange.observers.length > 0;
    this.hasCustomButtonHandler = this.onCustomAction.observers.length > 0 && !!this.config.showCustomButton && (this.customButtons?.length ?? 0) > 0;
    this.hasActionsHandler = this.onActions.observers.length > 0 && !!this.config.showActionsButton;
  }

  private initializePagination(): void {
    this.totalItems = this.data?.total || 0;
    this.totalPages = Math.ceil(this.totalItems / this.data.pageSize);
    this.currentPage = this.data.pageIndex + 1;
    this.startItem = this.data.pageIndex * this.data.pageSize + 1;
    this.endItem = Math.min(this.startItem + this.data.pageSize - 1, this.totalItems);
    this.generatePageNumbers();
  }

  private setupDebouncedSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.config.debounceTime || 500),
        takeUntil(this.destroy$)
      )
      .subscribe((searchText) => {
        this.filterText = searchText;
        if (this.config.clientSideSortingAndPagination) {
          this.processClientSideData();
        } else {
          this.onFilter.emit(searchText);
        }
      });
  }

  private initializeClientSideData(): void {
    if (this.config.clientSideSortingAndPagination) {
      this.allData = [...this.data.items];
      this.processClientSideData();
    }
  }

  private processClientSideData(): void {
    if (!this.config.clientSideSortingAndPagination) {
      return;
    }

    let processedData = [...this.allData];

    if (this.config.clientSideSortingAndPagination && this.filterText && this.filterText.trim()) {
      const filterLower = this.filterText.toLowerCase();
      processedData = processedData.filter((item: any) => {
        return this.headers.some(header => {
          if (header.type === 'actions') return false;
          const value = item[header.name];
          return value && value.toString().toLowerCase().includes(filterLower);
        });
      });
    }
    this.filteredData = processedData;

    if (this.config.clientSideSortingAndPagination && this.sortField) {
      processedData = [...processedData].sort((a, b) => {
        let aValue = a[this.sortField];
        let bValue = b[this.sortField];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    this.sortedData = processedData;

    if (this.config.clientSideSortingAndPagination) {
      const startIndex = this.data.pageIndex * this.data.pageSize;
      const endIndex = startIndex + this.data.pageSize;
      processedData = processedData.slice(startIndex, endIndex);
    }

    this.data = {
      items: processedData,
      total: this.config.clientSideSortingAndPagination ? this.filteredData.length : this.data.total,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    };

    this.initializePagination();
  }

  handleCreate(): void {
    this.onCreate.emit();
  }

  handleView(row: any): void {
    this.onView.emit(row);
  }

  handleEdit(row: any): void {
    this.onEdit.emit(row);
  }

  handleDelete(row: any): void {
    this.onDelete.emit(row);
  }

  handleCustomButton(key: string, row: any): void {
    this.onCustomAction.emit({ key, row });
  }

  handleActions(row: any): void {
    this.onActions.emit(row);
  }

  handleCellClick(row: any, header: IBasePaginationTableHeader): void {
    this.onCellClick.emit({ row, header });
  }

  handleSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    if (this.config.clientSideSortingAndPagination) {
      this.data.pageIndex = 0;
      this.processClientSideData();
    } else {
      this.onSort.emit({ field, direction: this.sortDirection });
    }
  }

  handleFilterChange(): void {
    this.searchSubject.next(this.filterText);
  }

  clearFilter(): void {
    this.filterText = '';
    this.searchSubject.next(this.filterText);
  }

  handlePageSizeChange(event: any): void {
    const newPageSize = parseInt(event.detail.value);
    this.pageSizeString = newPageSize.toString();

    if (this.config.clientSideSortingAndPagination) {
      this.data.pageSize = newPageSize;
      this.data.pageIndex = 0;
      this.processClientSideData();
    } else {
      this.onPageSizeChange.emit(newPageSize);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;

    if (this.config.clientSideSortingAndPagination) {
      this.data.pageIndex = page - 1;
      this.processClientSideData();
    } else {
      this.onPageChange.emit(page);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // ===== UTILITY METHODS =====
  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'swap-vertical-outline';
    }
    return this.sortDirection === 'asc' ? 'chevron-up-outline' : 'chevron-down-outline';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      // green statuses
      case 'activated':
      case 'paid':
      case 'active':
      case 'completed':
      case 'processed':
      case 'approved':
      case 'ongoing':
      case 'booking_pending':
      case 'new':
        return 'active';

      // yellow statuses
      case 'pending':
      case 'waiting':
      case 'waitingforapproval':
      case 'processing':
      case 'inactive':
      case 'rci':
      case 'unpaid':
        return 'pending';

      // red statuses
      case 'cancelled':
      case 'rejected':
      case 'failed':
      case 'payment_rejected':
      case 'failure':
        return 'inactive';

      default:
        return 'inactive';
    }
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      RCI: 'Change Request',
      ON_GOING: 'Ongoing'
    };

    return map[status]
      ?? status
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
  }

  getCurrencyCode(code: string) {
    switch (code?.toLowerCase()) {
      case 'usd':
        return 'usd';

      case 'sgd':
        return 'sgd';

      default:
        return 'sgd';
    }
  }

  getTypeString(typeString: string | null | undefined): string {
    if (!typeString) return "";
    return typeString
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getVisibleButtons(row: any): ICustomActionButton[] {
    return (this.customButtons || []).filter(btn => !btn.visible || btn.visible(row));
  }


  isActionsColumn(header: IBasePaginationTableHeader): boolean {
    return header.type === 'actions';
  }

  isClickableColumn(header: IBasePaginationTableHeader): boolean {
    return header.clickable === true && this.hasCellClickHandler;
  }

  getColumnClass(header: IBasePaginationTableHeader): string {
    if (this.isActionsColumn(header)) {
      return 'actions-header';
    }
    return header.cssClass || '';
  }

  getStatusHeader(): IBasePaginationTableHeader | undefined {
    return this.headers.find(h => h.type === 'status');
  }

  hasStatusHeader(): boolean {
    return this.headers.some(h => h.type === 'status');
  }

  getFirstHeaderName(): string {
    return this.headers[0]?.name || '';
  }

  getFirstHeader(): IBasePaginationTableHeader | undefined {
    return this.headers[0];
  }

  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/image/no-image.jpg';
    }
  }

  getMobileTextClass(header: IBasePaginationTableHeader, row: any): string {
    let classes = header.type + '-text-mobile';
    if (header.type === 'status') {
      classes += ' ' + this.getStatusClass(row[header.name] || '');
    }
    return classes;
  }

  formatCellValue(row: any, header: IBasePaginationTableHeader): string {
    const value = row[header.name];

    switch (header.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return value?.toString() || '0';
      case 'status':
        return value || '';
      default:
        return value || '';
    }
  }

  // ===== PRIVATE UTILITY METHODS =====
  private generatePageNumbers(): void {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pages.push(-1);
        }
        pages.push(this.totalPages);
      }
    }

    this.pageNumbers = pages;
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
      case 'active':
      case 'approved':
      case 'completed':
      case 'paid':
        return 'success';
      case 'pending':
      case 'waiting':
        return 'warning';
      case 'inactive':
      case 'cancelled':
      case 'locked':
        return 'danger';
      default:
        return 'medium';
    }
  }

  hasSpecificMobileCardComponent(): boolean {
    // This will be true when content is projected into the mobile-cards slot
    return !!this.config.mobileCardComponent;
  }

  // ===== SELECTION METHODS =====
  isRowSelected(row: any): boolean {
    return this.selectedRows.some(selected => selected === row);
  }

  toggleRowSelection(row: any): void {
    if (this.config.selectionType === 'single') {
      this.selectedRows = [row];
    } else {
      const index = this.selectedRows.findIndex(selected => selected === row);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      } else {
        this.selectedRows.push(row);
      }
    }
    this.onSelectionChange.emit([...this.selectedRows]);
  }

  selectAllRows(): void {
    if (this.config.selectionType === 'multiple') {
      this.selectedRows = [...this.data.items];
      this.onSelectionChange.emit([...this.selectedRows]);
    }
  }

  deselectAllRows(): void {
    this.selectedRows = [];
    this.onSelectionChange.emit([]);
  }

  isAllSelected(): boolean {
    return this.config.selectionType === 'multiple' &&
      this.data.items.length > 0 &&
      this.selectedRows.length === this.data.items.length;
  }

  isIndeterminate(): boolean {
    return this.config.selectionType === 'multiple' &&
      this.selectedRows.length > 0 &&
      this.selectedRows.length < this.data.items.length;
  }
}
