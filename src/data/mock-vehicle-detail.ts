import type { VehicleDetailData } from "@/types/vehicle";
import { mockVehicles } from "./mock-vehicles";

/**
 * Generate 30 days of health history for a vehicle.
 * Starts from a base score and adds realistic daily fluctuations.
 */
function generateHealthHistory(
  baseScore: number
): { date: string; score: number }[] {
  const history: { date: string; score: number }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Add some fluctuation (±8 points) around the base
    const fluctuation = Math.round((Math.random() - 0.5) * 16);
    const score = Math.max(0, Math.min(100, baseScore + fluctuation));
    history.push({
      date: date.toISOString().split("T")[0],
      score,
    });
  }

  // Ensure the last entry matches the current vehicle score
  if (history.length > 0) {
    history[history.length - 1].score = baseScore;
  }

  return history;
}

/**
 * Mock detail data keyed by vehicle ID.
 * Only v-001 and v-011 have rich DTC + maintenance data;
 * other vehicles get generated defaults.
 */
export const mockVehicleDetails: Record<string, VehicleDetailData> = {
  "v-001": {
    vehicle: mockVehicles.find((v) => v.id === "v-001")!,
    rpm: 1200,
    healthHistory: generateHealthHistory(92),
    dtcFaults: [],
    maintenanceHistory: [
      {
        id: "m-001",
        vehicle_id: "v-001",
        type: "oil_change",
        date: "2026-02-25",
        mileage: 45200,
        cost: 350,
        notes_ar: "تم تغيير زيت المحرك وفلتر الزيت — زيت موبيل 5W-30",
        notes_en: "Engine oil and oil filter changed — Mobil 5W-30",
      },
      {
        id: "m-002",
        vehicle_id: "v-001",
        type: "tire_rotation",
        date: "2026-02-10",
        mileage: 44000,
        cost: 150,
        notes_ar: "تدوير الإطارات الأربعة وفحص ضغط الهواء",
        notes_en: "Rotated all 4 tires and checked air pressure",
      },
      {
        id: "m-003",
        vehicle_id: "v-001",
        type: "brake_inspection",
        date: "2026-01-15",
        mileage: 42500,
        cost: 200,
        notes_ar: "فحص الفرامل — التيل بحالة جيدة ٧٠٪ متبقي",
        notes_en: "Brake inspection — pads in good condition, 70% remaining",
      },
      {
        id: "m-004",
        vehicle_id: "v-001",
        type: "filter_replacement",
        date: "2025-12-20",
        mileage: 41000,
        cost: 180,
        notes_ar: "تغيير فلتر الهواء وفلتر المكيف",
        notes_en: "Air filter and cabin filter replaced",
      },
      {
        id: "m-005",
        vehicle_id: "v-001",
        type: "general_inspection",
        date: "2025-11-05",
        mileage: 39500,
        cost: 500,
        notes_ar: "فحص شامل — جميع الأنظمة تعمل بشكل طبيعي",
        notes_en: "Full inspection — all systems operating normally",
      },
    ],
  },
  "v-011": {
    vehicle: mockVehicles.find((v) => v.id === "v-011")!,
    rpm: 4200,
    healthHistory: generateHealthHistory(23),
    dtcFaults: [
      {
        code: "P0301",
        description_ar: "خلل إشعال في الأسطوانة رقم ١",
        description_en: "Cylinder 1 misfire detected",
        severity: "critical",
        detected_at: "2026-01-15",
      },
      {
        code: "P0128",
        description_ar: "درجة حرارة سائل التبريد أقل من المعدل الطبيعي",
        description_en: "Coolant thermostat temperature below regulating",
        severity: "warning",
        detected_at: "2026-01-20",
      },
      {
        code: "P0562",
        description_ar: "جهد النظام الكهربائي منخفض",
        description_en: "System voltage low",
        severity: "critical",
        detected_at: "2026-02-01",
      },
      {
        code: "P0420",
        description_ar: "كفاءة منخفضة لمحول العادم — البنك ١",
        description_en: "Catalyst system efficiency below threshold — Bank 1",
        severity: "warning",
        detected_at: "2026-01-10",
      },
    ],
    maintenanceHistory: [
      {
        id: "m-010",
        vehicle_id: "v-011",
        type: "oil_change",
        date: "2025-08-15",
        mileage: 78000,
        cost: 450,
        notes_ar: "تغيير زيت المحرك — تأخر عن الموعد المحدد",
        notes_en: "Engine oil change — overdue",
      },
      {
        id: "m-011",
        vehicle_id: "v-011",
        type: "battery_replacement",
        date: "2025-06-10",
        mileage: 72000,
        cost: 650,
        notes_ar: "تركيب بطارية جديدة — البطارية القديمة ضعيفة",
        notes_en: "New battery installed — old battery weak",
      },
      {
        id: "m-012",
        vehicle_id: "v-011",
        type: "brake_inspection",
        date: "2025-04-20",
        mileage: 68000,
        cost: 800,
        notes_ar: "تغيير تيل الفرامل الأمامية وتسوية الأقراص",
        notes_en: "Front brake pads replaced and rotors resurfaced",
      },
    ],
  },
};

/**
 * Look up vehicle detail data by ID.
 * For vehicles without specific detail data, generate defaults from mockVehicles.
 */
export function getVehicleDetail(
  vehicleId: string
): VehicleDetailData | undefined {
  if (mockVehicleDetails[vehicleId]) {
    return mockVehicleDetails[vehicleId];
  }

  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return undefined;

  return {
    vehicle,
    rpm: Math.floor(Math.random() * 2500) + 700,
    healthHistory: generateHealthHistory(vehicle.health_score),
    dtcFaults: vehicle.active_dtcs.map((code) => ({
      code,
      description_ar: `كود عطل ${code}`,
      description_en: `Fault code ${code}`,
      severity: "warning" as const,
      detected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    })),
    maintenanceHistory: [
      {
        id: `m-${vehicleId}-001`,
        vehicle_id: vehicleId,
        type: "oil_change" as const,
        date: "2026-02-01",
        mileage: 40000,
        cost: 350,
        notes_ar: "تغيير زيت المحرك الدوري",
        notes_en: "Routine engine oil change",
      },
    ],
  };
}
