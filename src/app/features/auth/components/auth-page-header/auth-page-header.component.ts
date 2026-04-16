import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-page-header',
  imports: [RouterLink],
  templateUrl: './auth-page-header.component.html',
  styleUrl: './auth-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageHeaderComponent {
  readonly showSignupLink = input(true);
}
