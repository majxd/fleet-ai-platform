'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export type RealtimePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, any>;
  old: Record<string, any>;
};

export function useRealtimeSubscription(
  tables: string[],
  onUpdate: (table: string, payload: RealtimePayload) => void
) {
  // Join tables to create a stable dependency check
  const tablesKey = tables.slice().sort().join(',');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    let channel = supabase.channel('fleet-changes');

    tables.forEach((table) => {
      channel = channel.on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`${table} change:`, payload);
          onUpdate(table, payload as unknown as RealtimePayload);
        }
      );
    });

    channel.subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tablesKey, onUpdate]);
}
