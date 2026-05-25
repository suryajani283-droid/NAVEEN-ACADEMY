const toggleMaintenance = async () => {
  const newState = !enabled

  try {
    const res = await fetch('/api/admin/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: newState }),
      credentials: 'include',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || `Request failed with status ${res.status}`)
    }

    // Success
    setEnabled(newState)
    document.cookie = `maintenance_mode=${newState}; path=/; max-age=86400; samesite=strict`
    alert(newState ? '✅ Maintenance mode ON' : '✅ Maintenance mode OFF - Site is live now')
  } catch (error) {
    console.error('Maintenance toggle error:', error)
    alert(`❌ Failed to toggle: ${error.message}`)
  }
}