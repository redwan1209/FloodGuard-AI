import { Shelter, FloodRiskAssessment } from '../types';

export interface RankedShelter extends Shelter {
  distanceKm: number;
  occupancyPercent: number;
  recommendationRank: number;
  evacuationViability: 'OPTIMAL' | 'RECOMMENDED' | 'BACKUP' | 'AT_CAPACITY';
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function rankSheltersForLocation(
  shelters: Shelter[],
  originCoords: [number, number],
  assessment?: FloodRiskAssessment | null
): RankedShelter[] {
  // Determine dynamic occupancy surge factor based on risk severity
  let occupancySurge = 1.0;
  if (assessment) {
    if (assessment.riskLevel === 'SEVERE') occupancySurge = 1.65;
    else if (assessment.riskLevel === 'HIGH') occupancySurge = 1.35;
    else if (assessment.riskLevel === 'MODERATE') occupancySurge = 1.12;
  }

  const calculated = shelters.map((shelter) => {
    const distanceKm = haversineDistanceKm(
      originCoords[0],
      originCoords[1],
      shelter.coordinates[0],
      shelter.coordinates[1]
    );

    // Simulated responsive occupancy: under severe flood alerts, evacuees flood into high-ground camps
    const adjustedOccupancy = Math.min(
      shelter.totalCapacity,
      Math.round(shelter.currentOccupancy * occupancySurge)
    );
    const occupancyPercent = Math.round((adjustedOccupancy / shelter.totalCapacity) * 100);

    // Dynamically adjust road accessibility if flood risk is severe and shelter elevation margin is low
    let dynamicRoadStatus = shelter.roadAccessibility;
    if (assessment?.riskLevel === 'SEVERE') {
      if (shelter.safetyMarginAboveFloodM < 18 && dynamicRoadStatus === 'CLEAR') {
        dynamicRoadStatus = 'CAUTION';
      } else if (shelter.safetyMarginAboveFloodM < 12) {
        dynamicRoadStatus = 'FLOODED';
      }
    } else if (assessment?.riskLevel === 'HIGH') {
      if (shelter.safetyMarginAboveFloodM < 12 && dynamicRoadStatus === 'CLEAR') {
        dynamicRoadStatus = 'CAUTION';
      }
    }

    let viability: 'OPTIMAL' | 'RECOMMENDED' | 'BACKUP' | 'AT_CAPACITY' = 'RECOMMENDED';
    if (occupancyPercent >= 95) {
      viability = 'AT_CAPACITY';
    } else if (dynamicRoadStatus === 'FLOODED') {
      viability = 'BACKUP';
    } else if (
      dynamicRoadStatus === 'CLEAR' &&
      shelter.safetyMarginAboveFloodM >= 15 &&
      occupancyPercent < 85 &&
      shelter.hasMedicalPost
    ) {
      viability = 'OPTIMAL';
    }

    return {
      ...shelter,
      currentOccupancy: adjustedOccupancy,
      roadAccessibility: dynamicRoadStatus,
      distanceKm,
      occupancyPercent,
      recommendationRank: 0,
      evacuationViability: viability
    };
  });

  // Sort by viability (OPTIMAL first), then distance, then elevation margin
  calculated.sort((a, b) => {
    const viabilityOrder = { OPTIMAL: 1, RECOMMENDED: 2, BACKUP: 3, AT_CAPACITY: 4 };
    if (viabilityOrder[a.evacuationViability] !== viabilityOrder[b.evacuationViability]) {
      return viabilityOrder[a.evacuationViability] - viabilityOrder[b.evacuationViability];
    }
    return a.distanceKm - b.distanceKm;
  });

  // Assign 1-indexed ranks
  return calculated.map((s, idx) => ({
    ...s,
    recommendationRank: idx + 1
  }));
}
