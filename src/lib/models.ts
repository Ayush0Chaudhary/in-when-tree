// src/lib/models.ts
export interface Part {
    id: string;
    name: string;
    description: string;
    quantity: number;
  }
  
  export type Order = {
    id: string;
    part: Part;
    quantity: number;
  };

  export type Comp = {
    id: string;
    name: string;
    description: string;
    parts: Part[];
  }
