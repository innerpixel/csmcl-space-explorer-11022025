export function useExternalDocs() {
  const docsBaseUrl = 'https://innerpixel.github.io/csmcl-space-explorer-11022025'
  
  const fetchDocumentation = async (path) => {
    try {
      const response = await fetch(`${docsBaseUrl}/${path}`)
      return await response.json()
    } catch (error) {
      console.error('Error loading documentation:', error)
      return null
    }
  }

  return {
    fetchDocumentation
  }
}
