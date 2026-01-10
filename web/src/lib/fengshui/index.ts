export * from './types';
export { DayScore } from './DayScore';
// FengShuiRepository is NOT exported here to prevent JSON bundling in client
// For server-side use: import { FengShuiServerRepository } from '@/lib/fengshui/FengShuiServerRepository'
// For client-side use: import { fetchFengShuiByDate } from '@/lib/fengshui/client'
// Legacy import (DEPRECATED): import { FengShuiRepository } from '@/lib/fengshui/FengShuiRepository'
