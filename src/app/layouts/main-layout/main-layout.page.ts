import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from 'src/app/services/base/theme.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.page.html',
  styleUrls: ['./main-layout.page.scss'],
  standalone: false,
})
export class MainLayoutPage {
  themeService = inject(ThemeService);
  isSidebarOpen = signal(false);

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard', exact: true },
    { label: 'Orders', icon: 'shopping_cart', link: '/orders', exact: false },
    { label: 'Drivers', icon: 'person', link: '/drivers', exact: false },
    { label: 'Vehicles', icon: 'local_shipping', link: '/vehicles', exact: false },
    { label: 'Dispatch', icon: 'map', link: '/dispatch', exact: false },
    { label: 'Billing', icon: 'payments', link: '/billing', exact: false },
    { label: 'Settings', icon: 'settings', link: '/settings', exact: false },
  ];
}
