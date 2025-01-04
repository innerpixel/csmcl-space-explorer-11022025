import { computed } from 'vue'
import { useUserStore } from '../stores/user'

export function usePermissions() {
  const userStore = useUserStore()

  const canEdit = computed(() => userStore.isAdmin)
  const canView = computed(() => userStore.isLoggedIn)
  const canManageUsers = computed(() => userStore.isAdmin)
  const canAccessExplorer = computed(() => userStore.isExplorer && !userStore.isExplorerExpired)

  return {
    canEdit,
    canView,
    canManageUsers,
    canAccessExplorer
  }
}
