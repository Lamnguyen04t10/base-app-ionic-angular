import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBasePaginationTableData, IBasePaginationTableHeader, IBasePaginationTableConfig } from 'src/app/ui-components/table/base-pagination-table/base-pagination-table.component';

@Component({
  selector: 'base-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false,
})
export class OrdersPage implements OnInit {

  private fb = inject(FormBuilder)


  form: FormGroup = this.fb.group({
    inputTest1: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(20)])],
  });
  ngOnInit() { }
  orders = signal<any>([
    {
      id: '1',
      orderNo: 'ORD-2024-001',
      client: 'McDonald\'s',
      pickupAddress: '123 Burger St, North Zone',
      deliveryAddress: '456 Happy Ave, South Zone',
      zone: 'North',
      cutoff: '10:00 AM',
      slaDueTime: '12:30 PM',
      driverType: 'Internal',
      status: 'In Progress',
      createdTime: '2024-03-01 08:30'
    },
    {
      id: '2',
      orderNo: 'ORD-2024-002',
      client: 'Whitecoat Medical',
      pickupAddress: '789 Clinic Rd, Central',
      deliveryAddress: '321 Patient Ln, West',
      zone: 'Central',
      cutoff: '02:00 PM',
      slaDueTime: '04:00 PM',
      driverType: 'External',
      status: 'Assigned',
      createdTime: '2024-03-01 09:15'
    },
    {
      id: '3',
      orderNo: 'ORD-2024-003',
      client: 'Internal Project A',
      pickupAddress: 'Warehouse 5, East',
      deliveryAddress: 'Retail Outlet 12, South',
      zone: 'East',
      cutoff: '06:00 PM',
      slaDueTime: '08:00 PM',
      driverType: 'Internal',
      status: 'Pending',
      createdTime: '2024-03-01 10:00'
    },
    {
      id: '4',
      orderNo: 'ORD-2024-004',
      client: 'McDonald\'s',
      pickupAddress: 'Branch 22, West',
      deliveryAddress: 'Office Complex B, Central',
      zone: 'West',
      cutoff: '10:00 AM',
      slaDueTime: '11:30 AM',
      driverType: 'Internal',
      status: 'Completed',
      createdTime: '2024-03-01 07:45'
    },
    {
      id: '5',
      orderNo: 'ORD-2024-005',
      client: 'Global Logistics',
      pickupAddress: 'Port Terminal 1',
      deliveryAddress: 'Distribution Center 4',
      zone: 'South',
      cutoff: '02:00 PM',
      slaDueTime: '05:00 PM',
      driverType: 'External',
      status: 'Failed',
      createdTime: '2024-03-01 11:20'
    }
  ]);

  getStatusClass(status: any): string {
    switch (status) {
      case 'Pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'Assigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'In Progress': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
