/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import {AuthenticationStrategy} from '@loopback/authentication';
import {AuthenticationBindings} from '@loopback/authentication/dist/keys';
import {AuthenticationMetadata} from '@loopback/authentication/dist/types';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
const fetch = require('node-fetch');

export class AuthStrategy implements AuthenticationStrategy {
  name= 'auth';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
  ) {

  }

  /**
   * Autenticación de un usuario frente a una acción en la base de datos
   * @param request la solicitud con el token
   * @returns el perfil de usuario, undefined cuando no tiene permiso o un httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (token) {
      const idMenu: string = this.metadata[0].options![0];
      const accion: string = this.metadata[0].options![1];
      console.log(this.metadata);

      const datos = {token: token, idMenu: idMenu, accion: accion};
      const urlValidarPermisos = `${ConfiguracionSeguridad.enlaceMicroservicioSeguridad}/validar-permisos`;
      let res = undefined;
      try {
        await fetch(urlValidarPermisos, {
          method: 'post',
          body: JSON.stringify(datos),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: {'Content-Type': 'application/json'},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).then((res: any) => res.json())
          .then((json: any) => {
            res = json;
          });
        if (res) {
          const perfil: UserProfile = Object.assign({
            permitido: "OK"
          });
          return perfil;
        } else {
          return undefined;
        }
      } catch (e) {
        throw new HttpErrors[401]("No se tiene permisos sobre la acción a ejecutar.");
      }
    }
    throw new HttpErrors[401]("No es posible ejecutar la acción por falta de un token.");
  }
}
