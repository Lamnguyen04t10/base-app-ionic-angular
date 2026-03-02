import { CommonModule } from '@angular/common';
import { compileComponentClassMetadata } from '@angular/compiler';
import {
  Component,
  ContentChild,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Common } from 'src/app/globals/common';
import { System } from 'src/app/services/constants/constants';
import { StatusBadgeModule } from "../../status-badge/status-badge.module";

export interface IDataTableHeader {
  name: string; // Name of the column, used for binding and translation
  label?: string;
  type: string; // Type of the column data (string, number, etc.)
  width?: number; // Width of the column
  currencyField?: any;
}

export interface IDataTable {
  pageIndex: number; // Current page index
  pageSize: number; // Number of items per page
  total: number; // Total number of items
  items: Record<string, any>[]; // The rows of data
}

@Component({
  selector: 'base-data-table',
  templateUrl: './base-data-table.component.html',
  styleUrls: ['./base-data-table.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, NgxDatatableModule, StatusBadgeModule],
})
export class BaseDataTableComponent implements OnInit {
  @ContentChild('customActions', { static: false })
  customActionsTemplate?: TemplateRef<any>;
  @Input() headers!: IDataTableHeader[];
  @Input() data!: IDataTable;
  @Input() actionWitdh: number = 200;
  @Input({
    required: false,
  })
  isShowAction: boolean = true;
  @Output() pageChange = new EventEmitter<any>();
  @Output() onDetail = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  handlePageChange(event: any) {
    this.pageChange.emit(event);
  }

  getDateRanges(value: string): string[] {
    return value.split(',').map((s) => s.trim());
  }

  triggerOpenDetails(row: any) {
    this.onDetail.emit(row);
  }

  handleRemove(row: any) {}

  getColor(status: string) {
    return `status-` + Common.getColorStatus(status);
  }

  getStatusString(code: string) {
    const appealStatuses = System.refundStatus;
    return appealStatuses.find((x) => x.value == code)?.name;
  }

  getRefundTypeString(code: string) {
    const refundTypes = System.refundType;
    return refundTypes.find((x) => x.value == code)?.name;
  }

  getWeekDaysText(days: number[] | string): string {
    if (typeof days === 'string') {
      days = (days as string)
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
    } else if (!Array.isArray(days) || days.length === 0) return '';
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    return days
      .sort((a, b) => a - b)
      .map((d) => dayNames[d] ?? '')
      .filter((name) => !!name)
      .join(', ');
  }

  getUnit(unitCode: string) {
    switch (unitCode) {
      case 'D':
        return 'Day(s)';
      case 'H':
        return 'Hour(s)';
      case 'M':
        return 'Minute(s)';
      default:
        return '';
    }
  }

  getCondition(condition: string) {
    switch (condition) {
      case 'AFTER':
        return 'After';
      case 'BEFORE':
        return 'Before';
      default:
        return '';
        break;
    }
  }
}
