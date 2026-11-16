"use client";

import type { DayFengShuiData } from "@/lib/fengshui/types";
import type { MonthTheme } from "@/lib/theme";
import { DayScoreBreakdownCard } from "./DayScoreBreakdownCard";
import { GoodHoursSection } from "./GoodHoursSection";
import { ActivitiesCard } from "./ActivitiesCard";
import { InfoGrid } from "./InfoGrid";
import { DirectionsSection } from "./DirectionsSection";

interface DayDetailSectionsProps {
  fengShuiData: DayFengShuiData;
  theme: MonthTheme;
  isTodayDate?: boolean;
  compact?: boolean;
  hoursSectionId?: string;
}

export function DayDetailSections({
  fengShuiData,
  theme,
  isTodayDate = false,
  compact = false,
  hoursSectionId = "gio-hoang-dao",
}: DayDetailSectionsProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Day Score Breakdown & Special Notes */}
      <DayScoreBreakdownCard
        fengShuiData={fengShuiData}
        theme={theme}
        compact={compact}
      />

      {/* 2. All 12 Canh Giờ */}
      <GoodHoursSection
        id={hoursSectionId}
        hoangDaoHours={fengShuiData.hd}
        theme={theme}
        isTodayDate={isTodayDate}
        compact={compact}
      />

      {/* 3. Ngọc Hạp Thông Thư: Good & Bad Activities */}
      <div
        className={`grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <ActivitiesCard
          title="Việc Nên Làm (Cát)"
          activities={fengShuiData.ga}
          type="good"
        />
        <ActivitiesCard
          title="Việc Kiêng Kỵ (Hung)"
          activities={fengShuiData.ba}
          type="bad"
        />
      </div>

      {/* 4. Full Stars, Conflicting Ages, Solar Term, 12 Trực, 28 Sao */}
      <InfoGrid fengShuiData={fengShuiData} theme={theme} />

      {/* 5. Auspicious Directions */}
      {fengShuiData.dir && fengShuiData.dir.length > 0 && (
        <DirectionsSection directions={fengShuiData.dir} theme={theme} />
      )}
    </div>
  );
}
