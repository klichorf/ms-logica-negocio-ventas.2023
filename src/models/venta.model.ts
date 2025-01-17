/* eslint-disable @typescript-eslint/naming-convention */
import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Producto} from './producto.model';
import {VentaProducto} from './venta-producto.model';

@model({
  settings: {
    foreignKeys: {
      fk_venta_idCliente: {
        name: "fk_venta_idCliente",
        entity: "Cliente",
        entityKey: "id",
        foreignKey: "clienteId"
      }
    }
  }
})
export class Venta extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  numero: number;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @property({
    type: 'boolean',
    default: false,
  })
  notificada?: boolean;

  @belongsTo(() => Cliente)
  clienteId: number;

  @hasMany(() => Producto, {through: {model: () => VentaProducto}})
  productos: Producto[];

  constructor(data?: Partial<Venta>) {
    super(data);
  }
}

export interface VentaRelations {
  // describe navigational properties here
}

export type VentaWithRelations = Venta & VentaRelations;
