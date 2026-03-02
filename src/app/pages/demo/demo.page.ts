import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBasePaginationTableData, IBasePaginationTableHeader, IBasePaginationTableConfig } from 'src/app/ui-components/table/base-pagination-table/base-pagination-table.component';

@Component({
  selector: 'base-demo',
  templateUrl: './demo.page.html',
  styleUrls: ['./demo.page.scss'],
  standalone: false,
})
export class DemoPage implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    inputTest1: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(20)])],
  });
  ngOnInit() { }

  data: IBasePaginationTableData = {
    items: Array.from({ length: 10 }, (_, i) => {
      const index = i + 1;

      return {
        id: index.toString(),
        orderNo: `ORD-${index.toString().padStart(5, '0')}`,
        clientCode: `CL-${(100 + index)}`,
        deliveryAddress: `Nha Trang City - Zone ${index}`,
        driverName: index % 2 === 0 ? `Driver ${index}` : null,
        vehicleNo: index % 2 === 0 ? `SGX-${2000 + index}` : null,
        totalAmount: 150000 + index * 10000,
        status: ['Pending', 'Assigned', 'InTransit', 'Completed', 'Cancelled'][index % 5],
        slaDueTime: new Date(Date.now() + index * 3600000),
        createdOn: new Date(),
      };
    }),
    total: 87,
    pageIndex: 0,
    pageSize: 10
  };

  headers: IBasePaginationTableHeader[] = [
    {
      label: 'ORDER NO',
      name: 'orderNo',
      type: 'string',
      sortable: true,
      iconName: 'receipt'
    },
    {
      label: 'CLIENT CODE',
      name: 'clientCode',
      type: 'string',
      sortable: true,
      iconName: 'business'
    },
    {
      label: 'DELIVERY ADDRESS',
      name: 'deliveryAddress',
      type: 'string',
      sortable: true,
      iconName: 'location'
    },
    {
      label: 'DRIVER',
      name: 'driverName',
      type: 'string',
      sortable: true,
      iconName: 'person'
    },
    {
      label: 'VEHICLE',
      name: 'vehicleNo',
      type: 'string',
      sortable: true,
      iconName: 'car'
    },
    {
      label: 'AMOUNT',
      name: 'totalAmount',
      type: 'currency',
      sortable: true,
      iconName: 'cash'
    },
    {
      label: 'SLA DUE',
      name: 'slaDueTime',
      type: 'date',
      sortable: true,
      iconName: 'time'
    },
    {
      label: 'STATUS',
      name: 'status',
      type: 'status',
      sortable: true,
      iconName: 'pulse'
    },
    {
      label: 'ACTIONS',
      name: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

  config: IBasePaginationTableConfig = {
    title: 'Order Management',
    showCreateButton: true,
    showEditButton: true,
    showViewButton: true,
    showDeleteButton: false, // thường order không delete
    createButtonText: 'Create Order',
    showFilter: true,
    filterPlaceholder: 'Search order, client, address...',
    filterLabel: 'Filter orders:',
    showPageSize: true,
    pageSizeOptions: [5, 10, 25, 50],
    showPagination: true,
    showMobileCards: true,
    mobileCardComponent: '',
    debounceTime: 500
  };
}
