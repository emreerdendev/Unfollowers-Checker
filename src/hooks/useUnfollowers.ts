import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchUnfollowers } from '../api/client'
import { track } from '../lib/analytics'
import type {
  ApiError,
  PlatformId,
  UnfollowersResponse,
} from '../types/platform'

interface SearchInput {
  platform: PlatformId
  handle: string
}

/**
 * Triggers an unfollowers lookup. Search is user-initiated (button / Enter),
 * so a mutation fits better than a query: `mutate({platform, handle})` maps 1:1
 * to the submit handler, and `isPending` / `data` / `error` drive the UI states.
 */
export const useUnfollowers = () =>
  useMutation<UnfollowersResponse, ApiError, SearchInput>({
    mutationFn: ({ platform, handle }) => fetchUnfollowers(platform, handle),
    onMutate: ({ platform }) => track('scan_started', { platform }),
    onSuccess: (data, { platform }) =>
      track('scan_completed', { platform, result_count: data.count }),
    onError: (error, { platform }) => {
      track('scan_failed', { platform, code: error.code })
      toast.error(error.message)
    },
  })
