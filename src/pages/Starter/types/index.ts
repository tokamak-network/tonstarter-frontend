export interface I_StarterProject {
  name: string;
  saleStart: string;
  saleEnd: string;
  status: StarterStatus;
}

export type StarterProject = I_StarterProject & {
  isExclusive: boolean;
};

export type StarterStatus = 'active' | 'upcoming' | 'past';
