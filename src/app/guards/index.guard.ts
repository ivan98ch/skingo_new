import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class IndexGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return  this.afAuth.authState.pipe(map( auth => {

      if (isNullOrUndefined(auth)) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }

    } ));

  }

}
