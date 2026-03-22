'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useCallback } from 'react';

export default function DashboardRealtime() {
  const router = useRouter();
  const t = useTranslations('common');

  const handleUpdate = useCallback((table: string, payload: any) => {
    router.refresh();
    toast.success(t('dataUpdated'));
  }, [router, t]);

  useRealtimeSubscription(['vehicles', 'alerts'], handleUpdate);

  return null; // This is a logic-only component rendering nothing
}
