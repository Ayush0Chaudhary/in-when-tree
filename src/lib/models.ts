// src/lib/models.ts
export interface Part {
    id: number;
    name: string;
    description: string;
    quantity: number;
  }
  
  export type Order = {
    id: number;
    description: string;
    component: Comp;
    quantity: number;
    customer: string;
    machine: string;
    grade: string;
    cavity: number;
    cast_wtg: number;
    status: string;
  };

  export type Comp = {
    id: number;
    name: string;
    description: string;
    parts: Part[];
    quantity: number[];
  }
