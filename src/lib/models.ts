// src/lib/models.ts
export interface Part {
    name: string;
    description: string;
    quantity: number;
  }
  
  export type Order = {
    part: Part;
    quantity: number;
    customer: string;
    machine: string;
    grade: string;
    cavity: number;
    castingWt: number;
  };