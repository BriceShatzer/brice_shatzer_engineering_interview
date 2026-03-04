import { writable } from 'svelte/store';
import type { DomainsResponse } from '$lib/types';

export const domains = writable<DomainsResponse | null>(null);
