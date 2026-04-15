import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AuthenticatedNavItem } from '../../authenticated-shell.constants';

@Component({
  selector: 'app-authenticated-nav-item',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './authenticated-nav-item.component.html',
  styleUrl: './authenticated-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedNavItemComponent {
  readonly item = input.required<AuthenticatedNavItem>();
  readonly exact = input(false);
  readonly collapsed = input(false);
}
