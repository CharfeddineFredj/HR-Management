import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserAuthService } from 'src/app/sevices/user-auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {

  constructor(private userAuth: UserAuthService) { }

  ngOnInit(): void { }

  isRoleAllowed(allowedRoles: string[]): boolean {
    const userRoles = this.userAuth.getRoles();
    return allowedRoles.some(role => userRoles.includes(role));
  }

 

}
