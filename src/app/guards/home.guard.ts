import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  userUID: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return  this.afAuth.authState.pipe(map( auth => {

      if (isNullOrUndefined(auth)) {
        this.router.navigate(['/login']);
        return false;
      } else {
        this.userUID = auth.uid;
        return true;
      }

    } ));

  }

}

// this.router.navigate(['/login']);
