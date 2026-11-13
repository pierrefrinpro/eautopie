// Fige les doses des calculateurs : si une formule change, ces tests cassent.
// Lancer : npm test
import { describe, expect, it } from 'vitest';
import {
  calculerAntiAlgues,
  calculerChloreChoc,
  calculerChloreEntretien,
  calculerCorrectionPh,
  calculerFloculant,
  calculerSel,
  calculerStabilisant,
  calculerTac,
  volumeRectangulaire,
  volumeRond,
} from './calculations';

describe('volumes', () => {
  it('bassin rectangulaire 8 x 4 x 1,5 m = 48 m³', () => {
    expect(volumeRectangulaire(8, 4, 1.5)).toBe(48);
  });
  it('bassin rond 4,57 m de diamètre, 1,22 m de profondeur ≈ 20 m³', () => {
    expect(volumeRond(4.57, 1.22)).toBe(20);
  });
});

describe('chlore d’entretien (produit à 65 %)', () => {
  it('40 m³ de 0,5 à 1 mg/L = 31 g', () => {
    expect(calculerChloreEntretien(40, 0.5, 1)).toBe(31);
  });
  it('aucune dose si le chlore est déjà au niveau visé', () => {
    expect(calculerChloreEntretien(40, 1.2, 1)).toBe(0);
  });
  it('cible par défaut de 1 mg/L', () => {
    expect(calculerChloreEntretien(10, 0)).toBe(15);
  });
});

describe('chlore choc', () => {
  it('50 m³ à 20 g/m³ = 1 000 g', () => {
    expect(calculerChloreChoc(50, 20)).toBe(1000);
  });
});

describe('pH', () => {
  it('pH 7,8 vers 7,2 sur 40 m³ : 1 920 g de pH−', () => {
    expect(calculerCorrectionPh(40, 7.8, 7.2)).toEqual({
      sens: 'baisser',
      grammes: 1920,
      produit: 'pH−',
    });
  });
  it('pH 6,9 vers 7,2 sur 30 m³ : 720 g de pH+', () => {
    expect(calculerCorrectionPh(30, 6.9, 7.2)).toEqual({
      sens: 'monter',
      grammes: 720,
      produit: 'pH+',
    });
  });
  it('écart sous 0,05 : rien à faire', () => {
    expect(calculerCorrectionPh(30, 7.22, 7.2).sens).toBe('ok');
  });
});

describe('autres produits', () => {
  it('stabilisant : 40 m³ de 10 à 30 mg/L = 800 g', () => {
    expect(calculerStabilisant(40, 10, 30)).toBe(800);
  });
  it('stabilisant : jamais de dose négative', () => {
    expect(calculerStabilisant(40, 50, 30)).toBe(0);
  });
  it('sel : 40 m³ de 2,5 à 4 g/L = 60 kg', () => {
    expect(calculerSel(40, 2.5, 4)).toBe(60);
  });
  it('anti-algues : 5 ml/m³ en préventif, 15 ml/m³ en curatif', () => {
    expect(calculerAntiAlgues(40, 'preventif')).toBe(200);
    expect(calculerAntiAlgues(40, 'curatif')).toBe(600);
  });
  it('floculant : 10 ml/m³', () => {
    expect(calculerFloculant(40)).toBe(400);
  });
  it('TAC : 40 m³ de 80 à 120 mg/L = 2 720 g de bicarbonate', () => {
    expect(calculerTac(40, 80, 120)).toBe(2720);
  });
});
