export type MesaEstado = 'available' | 'reserved' | 'occupied';

export interface MesaVisual {
  id: string;
  numero: number;
  capacidad: number;
  forma: 'round' | 'square';
  posicionX: number;
  posicionY: number;
  estado: MesaEstado;
}

export interface MesaPrototype {
  clone(data: Partial<MesaVisual>): MesaVisual;
}

class MesaBasePrototype implements MesaPrototype {
  constructor(private readonly base: MesaVisual) {}

  clone(data: Partial<MesaVisual>): MesaVisual {
    return { ...this.base, ...data } as MesaVisual;
  }
}

export const roundPrototype = new MesaBasePrototype({
  id: '',
  numero: 0,
  capacidad: 0,
  forma: 'round',
  posicionX: 0,
  posicionY: 0,
  estado: 'available',
});

export const squarePrototype = new MesaBasePrototype({
  id: '',
  numero: 0,
  capacidad: 0,
  forma: 'square',
  posicionX: 0,
  posicionY: 0,
  estado: 'available',
});

export function buildMesaVisual(data: MesaVisual): MesaVisual {
  const proto = data.forma === 'round' ? roundPrototype : squarePrototype;
  return proto.clone(data);
}
