import { planetsData } from './planets';
import { equipmentData } from './equipment';
import { attractionsData } from './attractions';
import type { Planet, Equipment, Attraction } from '../types';

export const mockApi = {
  getPlanets: (): Promise<Planet[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...planetsData]);
      }, 800 + Math.random() * 400);
    });
  },

  getEquipment: (planetId?: string): Promise<Equipment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...equipmentData];
        if (planetId) {
          const required = data.filter(e => e.required);
          const recommended = data.filter(e => 
            !e.required && e.recommendedPlanets.includes(planetId)
          );
          const optional = data.filter(e => 
            !e.required && !e.recommendedPlanets.includes(planetId)
          );
          data = [...required, ...recommended, ...optional];
        }
        resolve(data);
      }, 600 + Math.random() * 300);
    });
  },

  getAttractions: (planetId: string): Promise<Attraction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(attractionsData.filter(a => a.planetId === planetId));
      }, 500 + Math.random() * 300);
    });
  },

  getPlanetById: (planetId: string): Promise<Planet | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(planetsData.find(p => p.id === planetId));
      }, 400 + Math.random() * 200);
    });
  }
};
